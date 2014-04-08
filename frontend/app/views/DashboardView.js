// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'app/views/View',
  'app/templates/dashboard'
], function(
  View,
  dashboardTemplate
) {
  'use strict';

  var STATUS_TO_BTN_CLASS = {
    good: 'btn-success',
    late: 'btn-warning',
    bad: 'btn-danger'
  };

  /**
   * @name app.views.DashboardView
   * @constructor
   * @extends {app.views.View}
   * @param {object} options
   * @param {object} options.model
   */
  var DashboardView = View.extend({

    template: dashboardTemplate

  });

  DashboardView.prototype.initialize = function()
  {
    this.listenTo(this.model, 'reset', this.render);
  };

  DashboardView.prototype.serialize = function()
  {
    var counters = this.model;

    return {
      counters: counters.toJSON().map(function(counter)
      {
        counter.className = 'dashboard-counter-' + counter.status;

        if (counter.paused)
        {
          counter.className = 'dashboard-counter-paused';
        }
        else if (counter.status in STATUS_TO_BTN_CLASS)
        {
          counter.className +=
            ' ' + STATUS_TO_BTN_CLASS[counter.status];
        }

        return counter;
      })
    };
  };

  return DashboardView;
});
