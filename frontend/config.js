// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

require = {
  baseUrl: '/',
  paths: {
    'text': 'vendor/require/text',
    'i18n': 'vendor/require/i18n',
    'domReady': 'vendor/require/domReady',
    'Underscore': 'vendor/lodash/lodash.underscore',
    'jQuery': 'vendor/jquery/jquery',
    'Backbone': 'vendor/backbone/backbone',
    'Backbone.Layout': '/vendor/backbone.layoutmanager/backbone.layoutmanager',
    'moment': 'vendor/moment/moment',
    'Bootstrap': 'vendor/bootstrap/js/bootstrap',
    'socket.io': 'socket.io/socket.io',
    'h5.pubsub': 'vendor/h5.pubsub',
    'h5.rql': 'vendor/h5.rql'
  },
  shim: {
    'jQuery': {
      exports: 'jQuery'
    },
    'Underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['Underscore', 'jQuery'],
      exports: 'Backbone'
    },
    'Backbone.Layout': {
      deps: ['Backbone'],
      exports: 'Backbone.Layout'
    },
    'Bootstrap': ['jQuery']
  },
  config: {
    i18n: {
      locale: 'pl-pl'
    }
  }
};
