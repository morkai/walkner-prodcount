$(function()
{
  $('#addCounterForm, #editCounterForm').validate({
    rules: {
      name: 'required'
    }
  });
});
