'use strict';

var io = require('socket.io');

exports.start = function startIoModule(app)
{
  if (!app.httpServer)
  {
    throw new Error("io module requires the httpServer module");
  }

  app.io = io.listen(app.httpServer, {
    log: false
  });

  app.configure('production', function()
  {
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
  });

  app.io.sockets.on('connection', function(socket)
  {
    socket.on('echo', function()
    {
      socket.emit.apply(
        socket, ['echo'].concat(Array.prototype.slice.call(arguments))
      );
    });
  });
};
