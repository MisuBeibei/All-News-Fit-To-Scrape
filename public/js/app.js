// Save as URL of website
var baseURL = window.location.origin;
// Save to local storage, call it 'first'
localStorage.setItem('first', $('#next').attr('data-id'));

// Have this listen to the button 'next'
$(document).on('click', '#next', function() {
  var id = $(this).attr('data-id');
  $.get(baseURL + "/next/" + id, buttons);
});

// Have this listen to the button 'previous'
$(document).on('click', '#prev', function() {
  var id = $(this).attr('data-id');
  $.get(baseURL + "/prev/" + id, buttons);
});
