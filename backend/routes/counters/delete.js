'use strict';

module.exports = function deleteCounter(app, req, res, next)
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

    counter.remove(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        json: function()
        {
          res.send(204);
        }
      });
    });
  });
};
