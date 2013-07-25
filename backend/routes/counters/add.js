'use strict';

module.exports = function createCounter(app, req, res, next)
{
  var Counter = app.db.model('Counter');
  var counter = new Counter(req.body);

  counter.save(function(err)
  {
    if (err)
    {
      return next(err);
    }

    res.format({
      json: function()
      {
        res.send(201, counter);
      }
    });
  });
};
