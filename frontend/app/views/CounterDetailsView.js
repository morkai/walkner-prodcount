// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'app/views/View',
  'app/templates/details',
  'i18n!app/nls/counters'
], function(
  _,
  View,
  detailsTemplate
) {
  'use strict';

  /**
   * @name app.views.CounterDetailsView
   * @constructor
   * @extends {app.views.View}
   * @param {object} [options]
   */
  var CounterDetailsView = View.extend({

    template: detailsTemplate

  });

  CounterDetailsView.prototype.initialize = function()
  {
    this.listenTo(this.model, 'change', this.render);

    this.render();
  };

  CounterDetailsView.prototype.serialize = function()
  {
    return {
      data: this.model.toJSON()
    };
  };

  return CounterDetailsView;
});
