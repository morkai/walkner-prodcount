define([
  'Underscore',
  'jQuery',
  'app/views/View',
  'app/i18n',
  'app/templates/messages',
  'app/templates/message'
], function(
  _,
  $,
  View,
  t,
  messagesTemplate,
  messageTemplate
) {
  'use strict';

  var LOADING_MESSAGE_DELAY = 50;

  /**
   * @name app.views.MessagesView
   * @constructor
   * @extends {app.views.View}
   * @param {object} [options]
   */
  var MessagesView = View.extend({

    template: messagesTemplate,

    events: {
      'click .message': function(e)
      {
        this.hide($(e.currentTarget));
      }
    },

    topics: {
      'router.executing': function()
      {
        this.hide();
      }
    }

  });

  MessagesView.prototype.initialize = function()
  {
    /**
     * @private
     * @type {jQuery|null}
     */
    this.$loadingMessage = null;

    /**
     * @private
     * @type {number|null}
     */
    this.loadingTimer = null;

    /**
     * @private
     * @type {Array.<number>}
     */
    this.hideTimers = [];
  };

  MessagesView.prototype.destroy = function()
  {
    this.$loadingMessage = null;

    if (this.loadingTimer !== null)
    {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }

    if (this.hideTimers.length > 0)
    {
      this.hideTimers.forEach(clearTimeout);
      this.hideTimers = null;
    }

    this.$('.message').remove();
  };

  /**
   * @param {object} options
   * @returns {jQuery}
   */
  MessagesView.prototype.show = function(options)
  {
    var $message = $(messageTemplate({
      type: options.type || 'info',
      text: options.text
    }));

    this.$el.append($message);

    this.moveDown($message);

    $message
      .attr('data-top', $message.position().top)
      .css('margin-left', -($message.width() / 2) + 'px');

    if (options.immediate)
    {
      $message.css('opacity', 1);
    }
    else
    {
      $message.animate({opacity: 1});
    }

    this.scheduleHiding($message, options.time);

    return $message;
  };

  /**
   * @param {jQuery} [$message]
   * @param {boolean} [immediate]
   */
  MessagesView.prototype.hide = function($message, immediate)
  {
    if (!$message)
    {
      $message = this.$('.message');

      this.$loadingMessage = null;
    }
    else if ($message.hasClass('message-hiding'))
    {
      return;
    }
    else
    {
      $message.addClass('message-hiding');
    }

    if ($message.length === 1)
    {
      this.moveUp($message);
      this.removeHideTimer($message);
    }

    if (immediate)
    {
      $message.remove();
    }
    else
    {
      $message.animate({opacity: 0}, function()
      {
        $message.remove();
      });
    }
  };

  /**
   * @param {string} [text]
   */
  MessagesView.prototype.loading = function(text)
  {
    text = '<i class="icon-spinner icon-spin"></i><span>'
      + (_.isString(text) ? text : t('common', 'MSG_LOADING'))
      + '</span>';

    if (this.$loadingMessage !== null)
    {
      this.$loadingMessage.html(text);
    }
    else
    {
      if (this.loadingTimer !== null)
      {
        clearTimeout(this.loadingTimer);
      }

      this.loadingTimer = setTimeout(
        this.showLoadingMessage.bind(this, text),
        LOADING_MESSAGE_DELAY
      );
    }
  };

  MessagesView.prototype.loaded = function()
  {
    this.hideLoadingMessage();
  };

  /**
   * @param {string} [text]
   */
  MessagesView.prototype.loadingFailed = function(text)
  {
    this.hideLoadingMessage();

    this.show({
      type: 'error',
      text: _.isString(text) ? text : t('common', 'MSG_LOADING_FAILED')
    });
  };

  /**
   * @private
   */
  MessagesView.prototype.showLoadingMessage = function(text)
  {
    this.loadingTimer = null;
    this.$loadingMessage = this.show({
      type: 'warning',
      text: text,
      immediate: true
    });
  };

  /**
   * @private
   */
  MessagesView.prototype.hideLoadingMessage = function()
  {
    if (this.loadingTimer !== null)
    {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }

    if (this.$loadingMessage !== null)
    {
      this.hide(this.$loadingMessage);
      this.$loadingMessage = null;
    }
  };

  /**
   * @private
   */
  MessagesView.prototype.moveDown = function($newMessage)
  {
    this.moveTopBy(
      this.$('.message'),
      $newMessage,
      this.getMoveOffset($newMessage)
    );
  };

  MessagesView.prototype.moveUp = function($removedMessage)
  {
    this.moveTopBy(
      $removedMessage.prevAll('.message'),
      $removedMessage,
      -this.getMoveOffset($removedMessage)
    );
  };

  MessagesView.prototype.moveTopBy = function($messages, $skipMessage, offset)
  {
    $messages.each(function()
    {
      if (this === $skipMessage[0])
      {
        return;
      }

      var $message = $(this);
      var top = parseInt($message.attr('data-top'), 10) + offset;

      $message.attr('data-top', top);
      $message.animate({top: top + 'px'});
    });
  };

  /**
   * @private
   * @param {jQuery} $message
   * @returns {number}
   */
  MessagesView.prototype.getMoveOffset = function($message)
  {
    return $message.outerHeight() + 8;
  };

  /**
   * @private
   * @param {jQuery} $message
   * @param {number} time
   */
  MessagesView.prototype.scheduleHiding = function($message, time)
  {
    if (!_.isNumber(time))
    {
      return;
    }

    if (time < 1000)
    {
      time = 1000;
    }

    var hideTimer = setTimeout(this.hide.bind(this, $message), time);

    $message.data('hideTimer', hideTimer);

    this.hideTimers.push(hideTimer);
  };

  /**
   * @private
   * @param {jQuery} $message
   */
  MessagesView.prototype.removeHideTimer = function($message)
  {
    var hideTimer = $message.data('hideTimer');

    if (_.isUndefined(hideTimer))
    {
      return;
    }

    clearTimeout(hideTimer);

    $message.data('hideTimer', undefined);

    this.hideTimers.splice(this.hideTimers.indexOf(hideTimer), 1);
  };

  return MessagesView;
});
