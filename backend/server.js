'use strict';

var START_TIME = Date.now();

// TODO: Move to config file
var MODULE_START_TIMEOUT = 2000;

var step = require('h5.step');
var express = require('express');
var MessageBroker = require('h5.pubsub').MessageBroker;

var app = express();
app.startTime = START_TIME;
app.broker = new MessageBroker();

require('./utils/app').extend(app);
require('./utils/logs').extend(console);

/**
 * @private
 * @param {string} moduleName
 * @param {object} appModule
 * @returns {Error|null}
 */
function startModuleSync(moduleName, appModule)
{
  console.debug("%s module starting synchronously...", moduleName);

  try
  {
    appModule.start(app);
  }
  catch (err)
  {
    return err;
  }

  app.broker.publish('modules.started', moduleName);

  return null;
}

function startModuleAsync(moduleName, appModule, done)
{
  console.debug("%s module starting asynchronously...", moduleName);

  var startTimer = app.timeout(MODULE_START_TIMEOUT, function()
  {
    console.error(
      "%s module failed to start in the allowed time of %ds",
      moduleName,
      MODULE_START_TIMEOUT / 1000
    );

    process.exit(1);
  });

  appModule.start(app, function(err)
  {
    clearTimeout(startTimer);

    if (err)
    {
      if (!(err instanceof Error))
      {
        err = new Error(err.toString());
        err.stack = null;
      }

      err.moduleName = moduleName;
    }
    else
    {
      app.broker.publish('modules.started', moduleName);
    }

    done(err);
  });
}

function createStartModuleStep(startModules, moduleName, appModule)
{
  return function startModuleStep(err)
  {
    if (err)
    {
      return this.skip(err);
    }

    app.broker.publish('modules.starting', moduleName);

    startModules.currentModuleName = moduleName;

    if (appModule.start.length === 1)
    {
      err = startModuleSync(moduleName, appModule);

      if (err)
      {
        this.skip(err);
      }
    }
    else
    {
      startModuleAsync(moduleName, appModule, this.next());
    }
  };
}

function addStartModule(startModules, moduleName)
{
  var appModule;

  try
  {
    appModule = require('./modules/' + moduleName);
  }
  catch (err)
  {
    console.error(
      "%s module failed to load: %s",
      moduleName,
      app.stackOrMessage(err.stack)
    );

    process.exit(1);
  }

  if (appModule === null
    || typeof appModule !== 'object'
    || typeof appModule.start !== 'function')
  {
    console.error(
      "%s is not a valid module: missing the start() function",
      moduleName
    );

    process.exit(1);
  }

  startModules.push(createStartModuleStep(
    startModules, moduleName, appModule
  ));
}

step(
  function startModulesStep()
  {
    console.info('Starting...');

    var startModules = [];

    require('./modules').forEach(addStartModule.bind(null, startModules));

    var next = this.next();

    startModules.push(function(err)
    {
      if (err && !err.moduleName)
      {
        err.moduleName = startModules.currentModuleName;
      }

      next(err);
    });

    step(startModules);
  },
  function finishStartupStep(err)
  {
    if (err)
    {
      console.error(
        "%s module failed to start: %s",
        err.moduleName,
        app.stackOrMessage(err)
      );

      process.exit(1);
    }

    console.info(
      "Started the %s environment in %d ms",
      app.settings.env,
      Date.now() - app.startTime
    );

    app.broker.publish('app.started');
  }
);
