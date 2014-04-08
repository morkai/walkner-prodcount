// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

/*global module:false*/

module.exports = function(grunt)
{
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      backend: {
        files: {
          src: ['backend/**/*.js']
        },
        options: {
          maxparams: 4,
          globalstrict: true,
          node: true
        }
      },
      frontend: {
        files: {
          src: ['frontend/app/**/*.js']
        },
        options: {
          maxparams: 999,
          devel: true,
          browser: true,
          globals: {
            require: true,
            define: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
