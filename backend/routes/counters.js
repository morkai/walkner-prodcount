// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

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
