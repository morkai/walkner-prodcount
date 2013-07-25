'use strict';

exports.start = function startModelsModule(app, done)
{
  var modelsDir = app.pathTo('models');
  var modelsList = require(app.pathTo('models', 'index'));

  app.loadFiles(modelsDir, modelsList, done);
};
