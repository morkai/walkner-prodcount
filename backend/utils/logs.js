// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

var format = require('util').format;

/**
 * @param {object} object
 */
exports.extend = function(object)
{
  ['debug', 'info', 'warn', 'error'].forEach(function(level)
  {
    object[level] = function()
    {
      log(level, Array.prototype.slice.call(arguments));
    };
  });
};

function log(level, args)
{
  var message = level + '\t' + getDateString()
    + '\t' + format.apply(null, args).trim() + '\n';

  if (level === 'error')
  {
    process.stderr.write(message);
  }
  else
  {
    process.stdout.write(message);
  }
}

function getDateString()
{
  var now = new Date();
  var str = now.getUTCFullYear().toString().substr(2)
    + '-' + pad0(now.getUTCMonth() + 1)
    + '-' + pad0(now.getUTCDate())
    + ' ' + pad0(now.getUTCHours())
    + ':' + pad0(now.getUTCMinutes())
    + ':' + pad0(now.getUTCSeconds())
    + '.';

  var ms = now.getUTCMilliseconds();

  if (ms < 10)
  {
    str += '00';
  }
  else if (ms < 100)
  {
    str += '0';
  }

  str += ms;

  return str;
}

function pad0(str)
{
  return (str.toString().length === 1 ? '0' : '') + str;
}
