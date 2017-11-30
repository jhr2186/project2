'use strict';

var allJokes = null;
var jokeIndex = -1;
var firstLike = true;
var csrfToken = "";

var randomColor = function randomColor() {
  var letters = '56789ABCDEF';
  var color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)];
  }

  return color;
};

//set thumbs back to normal
var resetLikes = function resetLikes() {
  firstLike = true;

  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "";
};

//like the joke
var likeJoke = function likeJoke() {
  var newJoke = allJokes[jokeIndex];
  var change = 0;

  //check for first likes and double clicks
  if (firstLike) {
    firstLike = false;
    change = 1;
  } else if (document.querySelector("#like").style.backgroundColor !== "green") {
    change = 2;
  }

  document.querySelector("#like").style.backgroundColor = "green";
  document.querySelector("#dislike").style.backgroundColor = "";

  var serialized = '_id=' + newJoke._id + '&score=' + change + '&_csrf=' + csrfToken;

  sendAjax("POST", "/updateScore", serialized, function () {});
};

//dislike the joke
var dislikeJoke = function dislikeJoke() {
  var newJoke = allJokes[jokeIndex];
  var change = 0;

  //check for first likes and double clicks
  if (firstLike) {
    firstLike = false;
    change = -1;
  } else if (document.querySelector("#dislike").style.backgroundColor !== "red") {
    change = -2;
  }

  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "red";

  var serialized = '_id=' + newJoke._id + '&score=' + change + '&_csrf=' + csrfToken;

  sendAjax("POST", "/updateScore", serialized, function () {});
};

//get a random Joke
var randomJoke = function randomJoke() {
  var index = allJokes.length * Math.random();

  index = Math.floor(index);

  //make sure we don't get the same joke twice
  //if there is only 1 joke, ignore this
  if (allJokes.length > 1 && index === jokeIndex) {
    if (index === 0) {
      index++;
    } else {
      index--;
    }
  }

  jokeIndex = index;

  return allJokes[index];
};

var DadJoke = function DadJoke() {
  var color = randomColor();
  document.querySelector("#jokeView").style.backgroundColor = color;

  //if nobody has made any jokes
  if (allJokes.length === 0) {
    return React.createElement(
      'p',
      { className: 'displayJoke' },
      'Nobody has made any jokes yet. That\'s lamer than my jokes!'
    );
  }

  var joke = randomJoke();

  return React.createElement(
    'div',
    { className: 'jokeArea' },
    ',',
    React.createElement(
      'p',
      { className: 'displayJoke' },
      joke.joke
    ),
    React.createElement('img', { src: 'assets/img/thumbdown.png', alt: 'thumbs down', className: 'dislike', id: 'dislike', onClick: dislikeJoke }),
    React.createElement('img', { src: 'assets/img/thumbup.png', alt: 'thumbs up', className: 'like', id: 'like', onClick: likeJoke })
  );
};

var newJoke = function newJoke() {
  if (allJokes.length !== 0) {
    resetLikes();
    loadJokesFromServer();
  }
};

var ViewFooter = function ViewFooter() {
  return React.createElement(
    'button',
    { className: 'nextJoke', onClick: newJoke },
    'Next Joke'
  );
};

var loadJokesFromServer = function loadJokesFromServer() {
  sendAjax('GET', '/getAllJokes', null, function (data) {
    allJokes = data.jokes;

    ReactDOM.render(React.createElement(DadJoke, null), document.querySelector("#jokeView"));
  });
};

var setup = function setup(csrf) {
  loadJokesFromServer();

  ReactDOM.render(React.createElement(ViewFooter, null), document.querySelector("#jokeScroll"));

  csrfToken = csrf;
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();

  console.log("document ready");
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageOb = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
