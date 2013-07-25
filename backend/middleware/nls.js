'use strict';

var EOL = require('os').EOL;
var fs = require('fs');
var _ = require('lodash');
var MessageFormat = require('messageformat');

module.exports = function createNlsMiddleware(options)
{
  if (!_.isObject(options))
  {
    options = {};
  }

  if (!_.isString(options.jsonPath))
  {
    options.jsonPath = 'nls';
  }

  if (options.jsonPath[options.jsonPath.length - 1] === EOL)
  {
    options.jsonPath = options.jsonPath.substr(0, options.jsonPath.length - 2);
  }

  if (!_.isString(options.locale))
  {
    options.locale = 'en';
  }

  return function nlsMiddleware(req, res, next)
  {
    var matches = req.url.match(/^(?:\/[a-z0-9\-]+)?\/([a-z0-9-_]+)\.js$/);

    if (matches === null)
    {
      return next();
    }

    var jsonFile = options.jsonPath + req.url + 'on';
    var locale = options.locale;
    var domain = matches[1];

    var dashPos = req.url.indexOf('/', 1);

    if (dashPos !== -1)
    {
      locale = req.url.substring(1, dashPos);
    }

    return compileJsonFile(jsonFile, locale, domain, res, next);
  };
};

function compileJsonFile(jsonFile, locale, domain, res, next)
{
  fs.readFile(jsonFile, 'utf8', function(err, contents)
  {
    if (err)
    {
      return next();
    }

    var mf = new MessageFormat(locale, function() {});
    var json;

    try
    {
      json = JSON.parse(contents);
    }
    catch (err)
    {
      return next(err);
    }

    var js = compileObject(mf, json);

    res.header('content-type', 'application/javascript');
    res.end([
      'define(["app/nls/locale/' + locale + '"], function(nls, locale) {',
      'var MessageFormat = {locale: {}};',
      'MessageFormat.locale["' + locale + '"] = locale;',
      'return ' + js + ';',
      '});'
    ].join('\n'));
  });
}

function compileObject(mf, obj)
{
  var js = '{\n';
  var keys = Object.keys(obj);
  var keysLength = keys.length;
  var lastKeyIndex = keysLength - 1;

  for (var i = 0; i < keysLength; ++i)
  {
    var key = keys[i];
    var value = obj[key];

    js += JSON.stringify(key) + ': ';

    if (_.isBoolean(value))
    {
      js += value ? 'true' : 'false';
    }
    else if (_.isObject(value))
    {
      js += compileObject(mf, value);
    }
    else
    {
      js += mf.precompile(mf.parse(String(value)));
    }

    if (i !== lastKeyIndex)
    {
      js += ',';
    }

    js += '\n';
  }

  return js + '}';
}
