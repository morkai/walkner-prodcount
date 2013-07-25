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
