'use strict';

// TODO: Move to config file
var COOKIE_SECRET = '1ee7prodcount';
var EJS_AMD_HELPERS = {
  t: 'app/i18n'
};

var express = require('express');
var ejsAmd = require('ejs-amd');
var messageFormatAmd = require('messageformat-amd');
var MongoStore = require('../utils/MongoStore')(express.session.Store);
var wrapAmd = require('../utils/wrapAmd');
var rqlMiddleware = require('../middleware/rql');
var nlsMiddleware = require('../middleware/nls');

exports.start = function startExpressModule(app)
{
  var production = app.get('env') === 'production';

  var staticPath = app.pathTo('..', production ? 'frontend-build' : 'frontend');

  app.set('views', app.pathTo('templates'));
  app.set('view engine', 'ejs');

  if (!production)
  {
    ejsAmd.wrapAmd = wrapEjsAmd;

    app.use('/app/templates/', ejsAmd.middleware({
      views: app.get('views')
    }));

    app.use('/app/nls/locale/', messageFormatAmd.localeMiddleware());

    app.use('/app/nls/', nlsMiddleware({
      jsonPath: app.pathTo('nls')
    }));
  }

  app.use(express.cookieParser(COOKIE_SECRET));
  app.use(express.session({
    store: new MongoStore(app.db.connection.db)
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(rqlMiddleware(app));
  app.use(app.router);
  app.use(express.static(staticPath));

  if (production)
  {
    app.use(express.errorHandler());
  }
  else
  {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
  }
};

/**
 * @private
 * @param {string} js
 * @returns {string}
 */
function wrapEjsAmd(js)
{
  return wrapAmd('return ' + js, EJS_AMD_HELPERS);
}
