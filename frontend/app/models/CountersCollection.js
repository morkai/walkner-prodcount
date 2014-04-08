// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'Backbone',
  'h5.rql/index',
  'app/models/Counter',
  'app/models/PaginationData'
], function(
  _,
  Backbone,
  rql,
  Counter,
  PaginationData
) {
  'use strict';

  /**
   * @name app.models.CountersCollection
   * @constructor
   * @extends {Backbone.Collection}
   * @param {object} [options]
   * @param {object|string} [options.rqlQuery]
   */
  var CountersCollection = Backbone.Collection.extend({

    url: '/counters',

    clientUrl: '#counters',

    model: Counter,

    rqlQuery: 'select(name)&sort(+name)&limit(10)'

  });

  CountersCollection.prototype.initialize = function(options)
  {
    /**
     * @type {h5.rql.Query}
     */
    this.rqlQuery = this.createRqlQuery(options.rqlQuery);

    /**
     * @type {app.models.PaginationData}
     */
    this.paginationData = new PaginationData();

    this.listenTo(this.paginationData, 'change:page', this.onPageChanged);
  };

  /**
   * @param {object} res
   * @returns {Array.<object>}
   */
  CountersCollection.prototype.parse = function(res)
  {
    this.paginationData.set({
      totalCount: res.totalCount,
      urlTemplate: this.genPaginationUrlTemplate(),
      skip: this.rqlQuery.skip,
      limit: this.rqlQuery.limit
    });

    return res.collection;
  };

  /**
   * @param {string} type
   * @param {Backbone.Model} model
   * @param {object} options
   * @returns {XMLHttpRequest}
   */
  CountersCollection.prototype.sync = function(type, model, options)
  {
    if (type === 'read' && !options.data)
    {
      options.data = this.rqlQuery.toString();
    }

    return Backbone.sync(type, model, options);
  };

  /**
   * @private
   * @param {object|string} rqlQuery
   * @returns {h5.rql.Query}
   */
  CountersCollection.prototype.createRqlQuery = function(rqlQuery)
  {
    rqlQuery = typeof rqlQuery === 'string'
      ? rql.parse(rqlQuery)
      : rql.Query.fromObject(rqlQuery);

    if (!rqlQuery.isEmpty())
    {
      return rqlQuery;
    }

    if (typeof this.rqlQuery === 'string')
    {
      return rql.parse(this.rqlQuery);
    }

    return typeof this.rqlQuery === 'string'
      ? rql.parse(this.rqlQuery)
      : rql.Query.fromObject(this.rqlQuery);
  };

  /**
   * @private
   */
  CountersCollection.prototype.genPaginationUrlTemplate = function()
  {
    var rqlQuery = this.rqlQuery;
    var skip = rqlQuery.skip;
    var limit = rqlQuery.limit;

    rqlQuery.skip = '${skip}';
    rqlQuery.limit = '${limit}';

    var urlTemplate = this.clientUrl + '?' + rqlQuery.toString();

    rqlQuery.skip = skip;
    rqlQuery.limit = limit;

    return urlTemplate;
  };

  /**
   * @private
   * @param {app.models.PaginationData} model
   * @param {number} newPage
   */
  CountersCollection.prototype.onPageChanged = function(model, newPage)
  {
    this.rqlQuery.skip = (newPage - 1) * this.rqlQuery.limit;
    this.fetch();
  };

  return CountersCollection;
});
