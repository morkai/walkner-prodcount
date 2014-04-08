// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'jQuery',
  'app/pages/Page',
  'app/models/CountersCollection',
  'app/models/Counter',
  'app/views/CountersListView',
  'app/views/PaginationView',
  'app/viewport',
  'app/i18n',
  'i18n!app/nls/counters'
], function(
  _,
  $,
  Page,
  CountersCollection,
  Counter,
  CountersListView,
  PaginationView,
  viewport,
  t
) {
  'use strict';

  /**
   * @name app.pages.CountersListPage
   * @constructor
   * @extends {app.pages.Page}
   * @param {object} [options]
   * @param {h5.rql.Query} [options.rql]
   */
  var BrowseCountersPage = Page.extend({

    breadcrumbs: [
      t.bound('counters', 'BREADCRUMBS_BROWSE')
    ],

    actions: [
      {
        label: t.bound('counters', 'PAGE_ACTION_ADD'),
        icon: 'plus',
        href: '#counters;add'
      }
    ]

  });

  BrowseCountersPage.prototype.initialize = function()
  {
    this.defineModels();
    this.defineViews();
  };

  BrowseCountersPage.prototype.render = function()
  {
    viewport
      .useLayout('page')
      .setId('counters-browse')
      .setBreadcrumbs(this.breadcrumbs)
      .setActions(this.actions)
      .setView('.bd', this.countersListView);

    var model = this.countersCollection;
    var xhr = model.fetch();

    var abortSub = this.broker
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
  };

  /**
   * @private
   */
  BrowseCountersPage.prototype.defineModels = function()
  {
    this.countersCollection = new CountersCollection({
      rqlQuery: this.options.rql
    });

    this.countersCollection.on('request', function()
    {
      viewport.msg.loading(t('counters', 'MSG_LOADING_COUNTERS'));
    });

    this.countersCollection.on('error', function()
    {
      viewport.msg.loadingFailed(t('counters', 'MSG_LOADING_COUNTERS_FAILED'));
    });
  };

  /**
   * @private
   */
  BrowseCountersPage.prototype.defineViews = function()
  {
    this.countersListView = new CountersListView({
      model: this.countersCollection
    });
  };

  return BrowseCountersPage;
});
