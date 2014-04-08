// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

module.exports = function startAppRoutes(app)
{
  app.get('/', showIndex.bind(null, app));
};

function showIndex(app, req, res)
{
  res.render('index');
}
