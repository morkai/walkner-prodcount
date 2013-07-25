'use strict';

module.exports = function startAppRoutes(app)
{
  app.get('/', showIndex.bind(null, app));
};

function showIndex(app, req, res)
{
  res.render('index');
}
