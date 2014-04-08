// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Backbone'
], function(
  Backbone
) {
  'use strict';

  /**
   * @name app.models.Model
   * @constructor
   * @extends {Backbone.Model}
   * @param {object} [attributes]
   */
  var Model = Backbone.Model.extend({

    idAttribute: '_id'

  });

  /**
   * @param {string} [action]
   * @returns {string}
   */
  Model.prototype.genUrl = function(action)
  {
    var url = Backbone.Model.prototype.url.call(this);

    if (typeof action === 'string')
    {
      url += ';' + action;
    }

    if (url[0] === '/')
    {
      url = url.substr(1);
    }

    return '#' + url;
  };

  return Model;
});
