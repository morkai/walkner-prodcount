'use strict';

exports.start = function startRoutingModule(app, done)
{
  app.loadDir(app.pathTo('routes'), done);
};
