// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

module.exports = function readCounter(app, req, res, next)
{
  var Counter = app.db.model('Counter');

  Counter.findById(req.params.id, function(err, counter)
  {
    if (err)
    {
      return next(err);
    }

    if (counter === null)
    {
      return res.send(404);
    }

    res.format({
      json: function()
      {
        res.send(counter);
      }
    });
  });
};
