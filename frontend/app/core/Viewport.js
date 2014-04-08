// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-prodcount project <http://lukasz.walukiewicz.eu/p/walkner-prodcount>

define([
  'Underscore',
  'Backbone.Layout',
  'app/core/util',
  'app/views/MessagesView'
], function(
  _,
  Layout,
  util,
  MessagesView
) {
  'use strict';

  var removeLayoutView = Layout.prototype.removeView;
  var setLayoutView = Layout.prototype.setView;

  /**
   * @name app.core.Viewport
   * @constructor
   * @extends Backbone.View
   * @param {object} options
   * @param {h5.pubsub.Broker} options.broker
   */
  function Viewport(options)
  {
    Layout.call(this, options);

    /**
     * @type {app.views.MessagesView}
     */
    this.msg = options.messagesView
      ? options.messagesView
      : new MessagesView({el: this.el});

    /**
     * @private
     * @type {h5.pubsub.Broker}
     */
    this.broker = options.broker;

    /**
     * @private
     * @type {object.<string, Backbone.Layout>}
     */
    this.layouts = {};

    /**
     * @private
     * @type {Backbone.Layout|null}
     */
    this.currentLayout = null;
  }

  util.inherits(Viewport, Layout);

  Viewport.prototype.cleanup = function()
  {
    this.broker.destroy();
    this.broker = null;
  };

  Viewport.prototype.afterRender = function()
  {

  };

  /**
   * @param {string} name
   * @param {Backbone.Layout} layout
   * @returns {app.core.Viewport}
   */
  Viewport.prototype.registerLayout = function(name, layout)
  {
    this.layouts[name] = layout;

    return this;
  };

  /**
   * @param {string} layoutName
   * @returns {Backbone.Layout}
   */
  Viewport.prototype.useLayout = function(layoutName)
  {
    var newLayout = this.layouts[layoutName];

    if (_.isUndefined(newLayout))
    {
      throw new Error("Unknown layout: " + layoutName);
    }

    if (newLayout === this.currentLayout)
    {
      if (_.isFunction(this.currentLayout.reset))
      {
        this.currentLayout.reset();
      }

      return this.currentLayout;
    }

    var selector = this.options.selector || '';

    if (_.isObject(this.currentLayout))
    {
      removeLayoutView.call(this, selector);
    }

    setLayoutView.call(this, selector, newLayout);

    if (!this.__manager__.hasRendered)
    {
      this.render();
    }

    this.currentLayout = newLayout;

    return this.currentLayout;
  };

  /**
   * @param {string|function|object} selector
   * @returns {Backbone.View}
   */
  Viewport.prototype.getView = function(selector)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot get a view without a layout.");
    }

    return this.currentLayout.getView(selector);
  };

  /**
   * @param {string|function|object} selector
   * @returns {Underscore}
   */
  Viewport.prototype.getViews = function(selector)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot get views without a layout.");
    }

    return this.currentLayout.getViews(selector);
  };

  /**
   * @param {string} selector
   * @param {Backbone.View} view
   * @returns {Backbone.View}
   */
  Viewport.prototype.insertView = function(selector, view)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot insert a view without a layout.");
    }

    return this.currentLayout.insertView(selector, view);
  };

  /**
   * @param {object.<string, Backbone.View>} views
   * @returns {Backbone.Layout}
   */
  Viewport.prototype.insertViews = function(views)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot insert views without a layout.");
    }

    return this.currentLayout.insertViews(views);
  };

  /**
   * @param {object.<string, Backbone.View>} views
   * @returns {Backbone.Layout}
   */
  Viewport.prototype.setViews = function(views)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot set views without a layout.");
    }

    return this.currentLayout.setViews(views);
  };

  /**
   * @param {string} selector
   * @param {Backbone.View} view
   * @returns {Backbone.View}
   */
  Viewport.prototype.setView = function(selector, view)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot set a view without a layout.");
    }

    return this.currentLayout.setView(selector, view);
  };

  /**
   * @param {string|function|object} selector
   * @returns {Underscore}
   */
  Viewport.prototype.removeView = function(selector)
  {
    if (this.currentLayout === null)
    {
      throw new Error("Cannot remove views without a layout.");
    }

    return this.currentLayout.removeView(selector);
  };

  Viewport.prototype.showDialog = function(dialogView)
  {

  };

  Viewport.prototype.closeDialog = function()
  {

  };

  return Viewport;
});
