define([
  'Backbone',
  'app/broker',
  'app/core/Router'
], function(
  Backbone,
  broker,
  Router
) {
  'use strict';

  // Disable Backbone's decodeURIComponent
  Backbone.History.prototype.getFragment = function(fragment)
  {
    return fragment ? fragment : this.getHash();
  };

  var router = new Router(broker);
  var backboneRouter = new Backbone.Router();

  backboneRouter.route('*catchall', 'catchall', function(url)
  {
    router.dispatch(url);
  });

  broker.subscribe('router.navigate', function(message)
  {
    var url = message.url;

    if (url[0] === '#')
    {
      url = url.substr(1);
    }

    backboneRouter.navigate(url, {
      trigger: message.trigger === true,
      replace: message.replace === true
    });
  });

  var notFoundUrl = '/404';

  broker.subscribe('router.404', function(req)
  {
    if (req.path === notFoundUrl)
    {
      throw new Error("404 route not found");
    }
    else
    {
      router.dispatch(notFoundUrl);
    }
  });

  return router;
});
