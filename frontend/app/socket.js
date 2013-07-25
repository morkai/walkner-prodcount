define([
  'socket.io',
  'app/broker',
  'app/core/Socket'
],
function(
  sio,
  broker,
  Socket
) {
  'use strict';

  var socket = new Socket(sio.connect('', {
    'resource': 'socket.io',
    'transports': [
      'websocket',
      'xhr-multipart',
      'xhr-polling'
    ],
    'connect timeout': 5000,
    'reconnect': true,
    'reconnection delay': 200,
    'reconnection limit': 5000,
    'max reconnection attempts': 10
  }));

  var wasConnected = false;

  socket.on('connect', function()
  {
    if (!wasConnected)
    {
      wasConnected = true;

      broker.publish('socket.connected');
    }
  });

  socket.on('connect_failed', function()
  {
    broker.publish('socket.connectFailed');
  });

  socket.on('message', function(message)
  {
    broker.publish('socket.message', message);
  });

  socket.on('disconnect', function()
  {
    broker.publish('socket.disconnected');
  });

  socket.on('reconnect', function()
  {
    broker.publish('socket.reconnected');
  });

  socket.on('reconnect_failed', function()
  {
    broker.publish('socket.reconnectFailed');
  });

  window.socket = socket;

  return socket;
});
