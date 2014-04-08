// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

'use strict';

var mongoose = require('mongoose');

module.exports = function setupCounterModel(app)
{
  var counterSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    updatedAt: {
      type: Date
    },
    paused: {
      type: Boolean,
      default: false
    },
    elapsedTime: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['good', 'late', 'bad', 'stopped'],
      default: 'stopped'
    },
    value: {
      type: Number,
      default: 0
    }
  });

  app.db.model('Counter', counterSchema);
};
