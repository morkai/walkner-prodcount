// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'Backbone.Layout',
  'app/core/util',
  'app/broker',
  'app/socket',
  'app/pubsub'
],
/**
 * @exports app/views/View
 * @param {Underscore} _
 * @param {Backbone.Layout} Layout
 * @param {app.core.util} util
 * @param {h5.pubsub.Broker} broker
 * @param {h5.core.Socket} socket
 * @param {h5.pubsub.Broker} pubsub
 */
function(
  _,
  Layout,
  util,
  broker,
  socket,
  pubsub
) {
  'use strict';

  /**
   * @name app.views.View
   * @constructor
   * @extends {Backbone.Layout}
   * @param {object} [options]
   * @param {h5.pubsub.Broker} [options.broker]
   * @param {app.core.Socket} [options.socket]
   * @param {h5.pubsub.Broker} [options.pubsub]
   */
  var View = function(options)
  {
    Layout.call(this, options);

    util.defineSandboxedProperty(this, 'broker', broker);
    util.defineSandboxedProperty(this, 'socket', socket);
    util.defineSandboxedProperty(this, 'pubsub', pubsub);

    util.subscribeTopics(this, 'broker', this.topics, true);
    util.subscribeTopics(this, 'pubsub', this.remoteTopics, true);
  };

  util.inherits(View, Layout);

  /**
   * @memberof app.views.View.prototype
   */
  View.prototype.cleanup = function()
  {
    util.cleanupSandboxedProperties(this);

    if (_.isFunction(this.destroy))
    {
      this.destroy();
    }
  };

  /**
   * @returns {boolean}
   */
  View.prototype.isRendered = function()
  {
    return this.__manager__.hasRendered === true;
  };

  return View;
});
