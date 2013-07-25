'use strict';

var browseRoute = require('./counters/browse');
var readRoute = require('./counters/read');
var editRoute = require('./counters/edit');
var addRoute = require('./counters/add');
var deleteRoute = require('./counters/delete');

module.exports = function startCounterRoutes(app)
{
  app.get('/counters', browseRoute.bind(null, app));

  app.get('/counters/:id', readRoute.bind(null, app));

  app.put('/counters/:id', editRoute.bind(null, app));

  app.post('/counters', addRoute.bind(null, app));

  app.del('/counters/:id', deleteRoute.bind(null, app));
};
