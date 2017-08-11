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

function buttons(res) {
  $('#picture>img').attr('src', res[0].imgURL);
  $('#content>h2').text(res[0].title);
  $('#content>p').text(res[0].summary);
  $('a.articleURL').attr('href', res[0].articleURL);

  comments(res[0].comments);
  $buttons = $('#buttons');
  if ($buttons.children().length === 1) {
    var $but = $('<button>').text('Previous').attr('id','prev').attr('data-id',res[0]._id);
    $buttons.prepend($but);
  } else {
    if ()
  }

}
