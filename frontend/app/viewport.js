define([
  'app/broker',
  'app/core/Viewport'
], function(
  broker,
  Viewport
) {
  'use strict';

  var viewport = new Viewport({
    el: document.body,
    selector: '.viewport'
  });

  broker.subscribe('i18n.reloaded', function()
  {
    viewport.render();
  });

  window.viewport = viewport;

  return viewport;
});
