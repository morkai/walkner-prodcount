// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

var step = require('h5.step');
var mongoSerializer = require('h5.rql/lib/serializers/mongoSerializer');

module.exports = function browseCounters(app, req, res, next)
{
  var Counter = app.db.model('Counter');
  var queryOptions = mongoSerializer.fromQuery(req.rql);

  step(
    function countCountersStep()
    {
      Counter.count(queryOptions.selector, this.next());
    },
    function findCountersStep(err, totalCount)
    {
      if (err)
      {
        return this.done(next, err);
      }

      this.totalCount = totalCount;

      if (totalCount > 0)
      {
        Counter
          .find(queryOptions.selector, queryOptions.fields, queryOptions)
          .exec(this.next());
      }
    },
    function sendResponseStep(err, counters)
    {
      if (err)
      {
        return this.done(next, err);
      }

      var totalCount = this.totalCount;

      res.format({
        json: function()
        {
          setTimeout(function()
          {
            res.json({
              totalCount: totalCount,
              collection: counters
            });
          }, 1000);
        }
      });
    }
  );
};
