'use strict';

module.exports = function editRoute(app, req, res, next)
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

    counter.set(req.body);
    counter.save(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        json: function()
        {
          res.send(counter);
        }
      });
    });
  });
};
