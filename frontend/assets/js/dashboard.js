$(function()
{
  var $counters = $('.dashboard-counters');
  var $zoomAction = $('.dashboard-zoom-action');
  var $zoomActionBg = $zoomAction.find('i, span');
  var $zoomRange = $('.dashboard-zoom-range');
  var $zoomValue = $('.dashboard-zoom-value');

  //

  $zoomValue.change(function()
  {
    $counters.css('font-size', this.value + 'em');

    localStorage.setItem('dashboard-zoom-value', this.value);
  });
  $zoomValue.mouseup(toggleZoomRange);

  //

  $zoomRange.hide();

  var dashboardZoomValue = localStorage.getItem('dashboard-zoom-value');

  if (dashboardZoomValue !== null)
  {
    $zoomValue.val(dashboardZoomValue).change();
  }

  $zoomAction.click(toggleZoomRange);

  //

  function toggleZoomRange()
  {
    if ($zoomRange.is(':visible'))
    {
      $zoomRange.fadeOut();
      $zoomActionBg.css('visibility', 'visible');
    }
    else
    {
      $zoomRange.fadeIn();
      $zoomActionBg.css('visibility', 'hidden');
    }
  }
});
