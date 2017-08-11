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
    if (res[0]._id === localStorage.getItem('first')) {
      $('#prev').remove();
    } else {
      $('#prev').attr('data-id', res[0]._id);
    }
  }
  $('#next').attr('data-id', res[0]._id);
  $('#post').attr('data-id', res[0]._id);
}

function comments(obj) {
  $('#comment-holder').remove();
  var $commentHolder = $('<div>').attr('id', 'comment-holder');
  for (var i = 0; i < obj.length; i++) {
    var $p = $('<p>').html('<span class="number">' + (i+1) + '</span> ' + obj[i].text + ' <a href="#" class="remove" data-id="' + obj[i]._id + '">X</a>');
    $commentHolder.append($p);
  }
  $('#nyt-three>div.comments').append($commendHolder);
}
