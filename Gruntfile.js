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
