// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

/**
 * @module app/views/PageLayout
 * @requires app/views/View
 * @requires app/templates/pageLayout
 */
define([
  'app/views/View',
  'app/templates/pageLayout'
], function(
  View,
  pageLayoutTemplate
) {
  'use strict';

  /**
   * @class
   * @extends {View}
   * @param {object} [options]
   */
  var PageLayout = View.extend({

    template: pageLayoutTemplate

  });

  PageLayout.prototype.initialize = function()
  {
    this.model = {
      id: null,
      actions: [],
      breadcrumbs: []
    };

    /**
     * @private
     * @type {jQuery|null}
     */
    this.$header = null;

    /**
     * @private
     * @type {jQuery|null}
     */
    this.$breadcrumbs = null;

    /**
     * @private
     * @type {jQuery|null}
     */
    this.$actions = null;
  };

  PageLayout.prototype.destroy = function()
  {
    this.$breadcrumbs = null;
    this.$actions = null;
  };

  PageLayout.prototype.afterRender = function()
  {
    this.$header = this.$('.page-header').first();
    this.$breadcrumbs = this.$('.page-breadcrumbs').first();
    this.$actions = this.$('.page-actions').first();

    this.renderBreadcrumbs();
    this.renderActions();
  };

  PageLayout.prototype.reset = function()
  {
    this.setId(null);

    if (this.$header)
    {
      this.$header.hide();
    }

    if (this.$breadcrumbs)
    {
      this.model.breadcrumbs = [];

      this.$breadcrumbs.empty();
    }

    if (this.$actions)
    {
      this.model.actions = [];

      this.$actions.empty();
    }
  };

  /**
   * @param id
   * @returns {*}
   */
  PageLayout.prototype.setId = function(id)
  {
    if (this.isRendered())
    {
      this.$el.attr('data-id', id);
    }

    this.model.id = id;

    return this;
  };

  /**
   * @param {function|object|string|Array.<object|string>} breadcrumbs
   * @param {string|function} breadcrumbs.label
   * @param {string} [breadcrumbs.href]
   * @returns {app.views.PageLayout}
   */
  PageLayout.prototype.setBreadcrumbs = function(breadcrumbs)
  {
    if (typeof breadcrumbs === 'function')
    {
      breadcrumbs = breadcrumbs();
    }

    if (!Array.isArray(breadcrumbs))
    {
      breadcrumbs = [breadcrumbs];
    }

    this.model.breadcrumbs = breadcrumbs.map(function(breadcrumb)
    {
      var breadcrumbType = typeof breadcrumb;

      if (breadcrumbType === 'string' || breadcrumbType === 'function')
      {
        breadcrumb = {label: breadcrumb, href: null};
      }

      if (typeof breadcrumb.href === 'string' && breadcrumb.href[0] !== '#')
      {
        breadcrumb.href = '#' + breadcrumb.href;
      }

      return breadcrumb;
    });

    if (this.$breadcrumbs)
    {
      this.renderBreadcrumbs();
    }

    return this;
  };

  /**
   * @param {function|object|string|Array.<object|string>} actions
   * @param {string} actions.label
   * @param {string} [actions.type]
   * @param {string} [actions.icon]
   * @param {string} [actions.href]
   * @param {function} [actions.callback]
   * @returns {app.views.PageLayout}
   */
  PageLayout.prototype.setActions = function(actions)
  {
    if (typeof actions === 'function')
    {
      actions = actions();
    }

    if (!Array.isArray(actions))
    {
      actions = [actions];
    }

    this.model.actions = actions.map(this.prepareAction.bind(this));

    if (this.$actions)
    {
      this.renderActions();
    }

    return this;
  };

  /**
   * @private
   * @param action
   * @returns {*}
   */
  PageLayout.prototype.prepareAction = function(action)
  {
    if (action.prepared)
    {
      return action;
    }

    if (typeof action.href === 'string')
    {
      if (action.href[0] !== '#')
      {
        action.href = '#' + action.href;
      }
    }
    else
    {
      action.href = '#';
    }

    if (typeof action.icon === 'string')
    {
      action.icon = 'icon-' + action.icon.split(' ').join(' icon-');
    }

    if (typeof action.className !== 'string')
    {
      action.className = '';
    }

    action.className = 'btn'
      + (typeof action.type === 'string' ? ' btn-' + action.type : '')
      + ' ' + action.className;

    action.prepared = true;

    return action;
  };

  /**
   * @private
   */
  PageLayout.prototype.renderBreadcrumbs = function()
  {
    var breadcrumbs = this.model.breadcrumbs;
    var html = '';

    for (var i = 0, l = breadcrumbs.length; i < l; ++i)
    {
      var breadcrumb = breadcrumbs[i];

      html += '<li>';

      if (i === l - 1 || !breadcrumb.href)
      {
        html += breadcrumb.label;
      }
      else
      {
        html += '<a href="' + breadcrumb.href + '">'
          + breadcrumb.label + '</a>';
      }
    }

    this.$breadcrumbs.html(html);
    this.$header.show();
  };

  /**
   * @private
   */
  PageLayout.prototype.renderActions = function()
  {
    var actions = this.model.actions;
    var html = '';

    for (var i = 0, l = actions.length; i < l; ++i)
    {
      var action = actions[i];

      html += '<li>';
      html += '<a class="' + action.className + '" href="' + action.href + '">';

      if (typeof action.icon === 'string')
      {
        html += '<i class="' + action.icon + '"></i>';
      }

      html += '<span>' + action.label + '</span></a>';
    }

    this.$actions.html(html);
    this.$header.show();
  };

  function PageAction()
  {

  }

  return PageLayout;
});
