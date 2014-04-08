// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'app/models/Model'
], function(
  Model
) {
  'use strict';

  /**
   * @name app.models.Counter
   * @constructor
   * @extends {app.models.Model}
   * @param {object} [attributes]
   */
  var Counter = Model.extend({

    urlRoot: '/counters',

    defaults: {
      name: '',
      updatedAt: null,
      paused: false,
      elapsedTime: 0,
      status: 'stopped',
      value: 0
    }

  });

  return Counter;
});
