'use strict';

// TODO: Move to config file
var PORT = 3000;

var util = require('util');
var http = require('http');
var domain = require('domain');

exports.start = function startHttpServerModule(app, done)
{
  function onServerError(err)
  {
    if (err.code === 'EADDRINUSE')
    {
      return done(util.format("port %d already in use?", PORT));
    }
  }

  var serverDomain = domain.create();

  serverDomain.run(function()
  {
    app.httpServer = http.createServer(function onRequest(req, res)
    {
      var reqDomain = domain.create();

      reqDomain.add(req);
      reqDomain.add(res);

      reqDomain.on('error', function onRequestError(err)
      {
        if (err.code !== 'ECONNRESET')
        {
          console.error("[httpServer] %s", err.message);
        }

        reqDomain.dispose();
      });

      app(req, res);
    });

    app.httpServer.once('error', onServerError);

    app.httpServer.listen(PORT, function()
    {
      app.httpServer.removeListener('error', onServerError);

      console.debug("httpServer listening on port %d", PORT);

      return done();
    });
  });
};
