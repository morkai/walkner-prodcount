$(function()
{
  var $deleteCounterDialog = $('#deleteCounterDialog');
  var $deleteBtn = $deleteCounterDialog.find('.btn-primary');

  $deleteBtn.on('click', function(e)
  {
    e.preventDefault();

    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      url: '/counters/' + $deleteBtn.$tableRow.attr('data-id'),
      success: function()
      {
        if ($deleteBtn.$tableRow)
        {
          $deleteBtn.$tableRow.fadeOut(function()
          {
            $deleteBtn.$tableRow.remove();
            $deleteBtn.$tableRow = null;
          });
        }

        $.quickAlert('success', 'Licznik został pomyślnie usunięty :)');
      },
      error: function()
      {
        $.quickAlert('error', 'Nie udało się usunąć wybranego licznika :(');
      },
      complete: function()
      {
        $deleteCounterDialog.modal('hide');
      }
    });
  });

  $('#countersTable').on('click', '.action-delete', function()
  {
    $deleteBtn.attr('href', this.href);
    $deleteBtn.$tableRow = $(this).closest('tr');
  });
});
