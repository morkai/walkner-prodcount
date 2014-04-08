// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'app/broker',
  'app/router',
  'app/viewport',
  'app/i18n',
  'app/models/CountersCollection',
  'app/models/Counter',
  'app/views/CountersListView',
  'app/views/CounterDetailsView',
  'app/pages/BrowseCountersPage',
  'i18n!app/nls/counters'
], function(
  _,
  broker,
  router,
  viewport,
  t,
  CountersCollection,
  Counter,
  CountersListView,
  CounterDetailsView,
  BrowseCountersPage
) {
  'use strict';

  router.map('/counters', function showCountersList(req)
  {
    var page = new BrowseCountersPage({
      rql: req.rql
    });

    page.render();
  });

  router.map('/counters;add', function showAddCounterForm()
  {
    console.log('New counter form...');
  });

  router.map('/counters/:id', function showCounterDetails(req)
  {
    new Counter({_id: req.params.id}).fetch({
      success: function(model)
      {
        viewport
          .useLayout('page')
          .setBreadcrumbs([
            {
              label: t.bound('counters', 'BREADCRUMBS_BROWSE'),
              href: 'counters'
            },
            model.get('name')
          ])
          .setView('.bd', new CounterDetailsView({
            model: model
          }));
      },
      error: function()
      {
        console.error("Failed to load a counter: %s", req.params.id);
      }
    });
  });

  router.map('/counters/:id;edit', function showEditCounterForm(req)
  {
    console.log('Edit counter %s...', req.params.id);
  });

  router.map('/counters/:id;delete', function showDeleteCounterForm(req)
  {
    console.log('Delete counter %s...', req.params.id);
  });
});
