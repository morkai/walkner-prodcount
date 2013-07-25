define([
  'app/broker',
  'app/router',
  'app/viewport',
  'app/models/CountersCollection',
  'app/views/DashboardView',
  'app/i18n',
  'i18n!app/nls/dashboard'
], function(
  broker,
  router,
  viewport,
  CountersCollection,
  DashboardView,
  t
) {
  'use strict';

  router.map('/', function showDashboard()
  {
    var model = new CountersCollection({
      rqlQuery: 'select(name,value,status)&sort(+name)&status!=stopped'
    });
    var view = new DashboardView({
      model: model
    });

    viewport
      .useLayout('page')
      .setId('dashboard')
      .setView('.bd', view);

    model.on('request', function()
    {
      viewport.msg.loading(t('dashboard', 'MSG_LOADING_ACTIVE_COUNTERS'));
    });

    model.on('error', function()
    {
      viewport.msg.loadingFailed(
        t('dashboard', 'MSG_LOADING_ACTIVE_COUNTERS_FAILED')
      );
    });

    var xhr = model.fetch();

    var abortSub = broker
      .subscribe('router.executing', function()
      {
        model.off();
        xhr.abort();
      })
      .setLimit(1);

    model.on('reset', function()
    {
      abortSub.cancel();
      viewport.msg.loaded();
    });
  });

  router.map('/locale/:locale', function changeLocale(req)
  {
    t.reload(req.params.locale);
  });
});
