// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

var STATS_PUBLISH_INTERVAL = 1000;

var _ = require('lodash');
var pubsub = require('h5.pubsub');

exports.start = function startPubsubModule(app)
{
  /*jshint maxstatements:999*/

  if (!app.io)
  {
    throw new Error("pubsub module requires the io module");
  }

  var stats = {
    publishedMessages: 0,
    receivedMessages: 0,
    sentMessages: 0,
    ignoredEchoes: 0,
    ignoredDuplications: 0,
    totalSubscriptions: 0,
    currentSubscriptions: 0,
    unsubscriptions: 0
  };

  /**
   * @type {number}
   */
  var nextMessageId = 0;

  /**
   * @type {object.<string, Array>}
   */
  var idToMessageMap = {};

  /**
   * @type {object.<string, object.<string, boolean>>}
   */
  var socketIdToMessagesMap = {};

  /**
   * @type {boolean}
   */
  var sendingScheduled = false;

  /**
   * @type {RegExp}
   */
  var invalidTopicRegExp = /^(\s*|\s*\.\s*)+$/;

  /**
   * @type {MessageBroker}
   */
  app.pubsub = new pubsub.MessageBroker();

  app.pubsub.on('message', function(topic, message, meta)
  {
    ++stats.publishedMessages;

    if (typeof meta.messageId === 'undefined')
    {
      meta.messageId = getNextMessageId();
    }

    idToMessageMap[meta.messageId] = [topic, message];
  });

  app.pubsub.on('subscribe', function()
  {
    ++stats.totalSubscriptions;
    ++stats.currentSubscriptions;
  });

  app.pubsub.on('cancel', function()
  {
    --stats.currentSubscriptions;
    ++stats.unsubscriptions;
  });

  app.io.sockets.on('connection', function onSocketConnect(socket)
  {
    socket.pubsub = app.pubsub.sandbox();
    socket.pubsub.onSubscriptionMessage =
      onSubscriptionMessage.bind(null, socket);

    socket.on('disconnect', onSocketDisconnect);
    socket.on('pubsub.subscribe', onSocketSubscribe);
    socket.on('pubsub.unsubscribe', onSocketUnsubscribe);
    socket.on('pubsub.publish', onSocketPublish);
  });

  publishPubsubStats();

  function publishPubsubStats()
  {
    app.pubsub.publish('stats.pubsub', stats);

    setTimeout(publishPubsubStats, STATS_PUBLISH_INTERVAL);
  }

  function onSocketDisconnect()
  {
    /*jshint validthis:true*/

    var socket = this;

    socket.pubsub.destroy();
    socket.pubsub = null;
  }

  /**
   * @param {Array.<string>} topics
   * @param {function} [cb]
   */
  function onSocketSubscribe(topics, cb)
  {
    /*jshint validthis:true*/

    var hasCb = typeof cb === 'function';

    if (!Array.isArray(topics))
    {
      if (hasCb)
      {
        cb("First argument must be an array of topics.");
      }

      return;
    }

    var socket = this;
    var pubsub = socket.pubsub;
    var notAllowedTopics = [];

    for (var i = 0, l = topics.length; i < l; ++i)
    {
      var topic = topics[i];

      if (isValidTopic(topic) && isSocketAllowedToSubscribe(socket, topic))
      {
        pubsub.subscribe(topic, pubsub.onSubscriptionMessage);
      }
      else
      {
        notAllowedTopics.push(topic);
      }
    }

    if (hasCb)
    {
      cb(null, notAllowedTopics);
    }

    var subscribedTopics = _.difference(topics, notAllowedTopics);

    if (subscribedTopics.length > 0)
    {
      console.debug(
        "[pubsub] %s subscribed to: %s", socket.id, subscribedTopics.join(', ')
      );
    }
  }

  /**
   * @param {Array.<string>} topics
   */
  function onSocketUnsubscribe(topics)
  {
    /*jshint validthis:true*/

    if (!Array.isArray(topics))
    {
      return;
    }

    var socket = this;
    var pubsub = socket.pubsub;

    for (var i = 0, l = topics.length; i < l; ++i)
    {
      var topic = topics[i];

      if (isValidTopic(topic))
      {
        pubsub.unsubscribe(topic);
      }
    }

    console.debug(
      "[pubsub] %s unsubscribed from: %s", socket.id, topics.join(', ')
    );
  }

  /**
   * @param {string} topic
   * @param {*} message
   * @param {object} meta
   * @param {function} [cb]
   */
  function onSocketPublish(topic, message, meta, cb)
  {
    /*jshint validthis:true*/

    var socket = this;

    ++stats.receivedMessages;

    meta.socketId = socket.id;

    socket.pubsub.publish(topic, message, meta);

    if (typeof cb === 'function')
    {
      cb();
    }

    console.debug(
      "[pubsub] %s published a message to %s:", socket.id, topic, message
    );
  }

  /**
   * @param {Socket} socket
   * @param {*} message
   * @param {string} topic
   * @param {object} meta
   */
  function onSubscriptionMessage(socket, message, topic, meta)
  {
    if (meta.socketId === socket.id)
    {
      ++stats.ignoredEchoes;

      return;
    }

    var socketMessagesMap = socketIdToMessagesMap[socket.id];

    if (typeof socketMessagesMap === 'undefined')
    {
      socketMessagesMap = socketIdToMessagesMap[socket.id] = {};
    }

    if (meta.messageId in socketMessagesMap)
    {
      ++stats.ignoredDuplications;

      return;
    }

    socketMessagesMap[meta.messageId] = true;

    scheduleSendMessages();
  }

  function scheduleSendMessages()
  {
    if (!sendingScheduled)
    {
      sendingScheduled = true;

      process.nextTick(sendMessages);
    }
  }

  function sendMessages()
  {
    /*jshint forin:false*/

    var sockets = app.io.sockets.sockets;
    var socketIds = Object.keys(socketIdToMessagesMap);

    for (var i = 0, l = socketIds.length; i < l; ++i)
    {
      var socketId = socketIds[i];
      var socket = sockets[socketId];
      var socketMessagesMap = socketIdToMessagesMap[socketId];
      var messageIds = Object.keys(socketMessagesMap);

      for (var j = 0, m = messageIds.length; j < m; ++j)
      {
        var message = idToMessageMap[messageIds[j]];

        socket.emit('pubsub.message', message[0], message[1]);

        ++stats.sentMessages;
      }
    }

    sendingScheduled = false;
    socketIdToMessagesMap = {};
    idToMessageMap = {};
  }

  /**
   * @param {string} topic
   * @returns {boolean}
   */
  function isValidTopic(topic)
  {
    return typeof topic === 'string'
      && topic.length > 0
      && invalidTopicRegExp.test(topic) === false;
  }

  /**
   * @param {Socket} socket
   * @param {string} topic
   * @returns {boolean}
   */
  function isSocketAllowedToSubscribe(socket, topic)
  {
    return socket && topic;
  }

  /**
   * @returns {string}
   */
  function getNextMessageId()
  {
    ++nextMessageId;

    if (nextMessageId === 0xFFFFFFFF)
    {
      nextMessageId = 1;
    }

    return nextMessageId.toString(36);
  }
};
