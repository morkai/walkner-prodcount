(function()
{
  'use strict';

  var domains = [];
  var i18n = null;

  require.onResourceLoad = function(context, map)
  {
    if (map.prefix === 'i18n')
    {
      var keys = context.defined[map.id];
      var domain = map.id.substr(map.id.lastIndexOf('/') + 1);

      if (i18n !== null)
      {
        i18n.register(domain, keys, map.id);
      }
      else
      {
        domains.push([domain, keys, map.id]);
      }
    }
    else if (map.id === 'app/i18n')
    {
      i18n = context.defined[map.id];
      i18n.config = context.config.config.i18n;

      domains.forEach(i18n.register.apply.bind(null));
      domains = null;
    }
  };
})();

require([
  'domReady',
  'jQuery',
  'Backbone',
  'Backbone.Layout',
  'app/viewport',
  'app/views/PageLayout',
  'app/views/NavbarView',
  'app/socket',
  'app/router',
  'app/routes/counters',
  'app/routes/dashboard',
  'Bootstrap',
  'i18n!app/nls/common'
],
function(
  domReady,
  $,
  Backbone,
  Layout,
  viewport,
  PageLayout,
  NavbarView)
{
  'use strict';

  Layout.configure({
    manage: true,
    el: false
  });

  viewport.registerLayout('page', new PageLayout({
    views: {
      '.navbar': new NavbarView()
    }
  }));

  domReady(function()
  {
    $('.loading').fadeOut(function() { $(this).remove(); });

    Backbone.history.start({
      root: '/',
      hashChange: true,
      pushState: false
    });
  });
});
