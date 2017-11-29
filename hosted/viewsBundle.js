"use strict";

var allJokes = null;
var jokeIndex = -1;
var firstLike = true;

//get a random color
var randomColor = function randomColor(){
  var letters = '56789ABCDEF';
  var color = '#';
  
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)];
  }
  
  return color;
};

//set thumbs back to normal
var resetLikes = function resetLikes(){
  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "";
};

//like the joke
var likeJoke = function likeJoke(){
  document.querySelector("#like").style.backgroundColor = "green";
  document.querySelector("#dislike").style.backgroundColor = "";
  
  var newJoke = allJokes[jokeIndex];
  
  if(firstLike){
    firstLike = false;
    newJoke.score++;
  } else {
    newJoke.score+=2;
  }
  
  sendAjax("POST", "/updateScore", newJoke, function(){});
}

//dislike the joke
var dislikeJoke = function dislikeJoke(){
  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "red";
  
  var newJoke = allJokes[jokeIndex];
  
  if(firstLike){
    firstLike = false;
    newJoke.score--;
  } else {
    newJoke.score-=2;
  }
  
  sendAjax("POST", "/updateScore", newJoke, function(){});
}

//get a random Joke
var randomJoke = function randomJoke(){
  var index = allJokes.length * Math.random();
  
  index = Math.floor(index);
  
  //make sure we don't get the same joke twice
  //if there is only 1 joke, ignore this
  if(allJokes.length > 1 && index === jokeIndex){
    if(index === 0){
      index++;
    }
    else{
      index--;
    }
  }
  
  jokeIndex = index;
  
  return allJokes[index];
};

var dadJoke = function dadJoke(){  
  var color = randomColor();
  document.querySelector("#jokeView").style.backgroundColor = color;
  
  //if nobody has made any jokes
  if(allJokes.length === 0){
    return React.createElement(
      "p",
      {className: "displayJoke"},
      "Nobody has made any jokes yet. That's lamer than my jokes!"
    );
  }
  
  var joke = randomJoke();
  
  return React.createElement(
    "div",
    {className: "jokeArea"},
    React.createElement(
      "p",
      {className: "displayJoke"},
      "",
      joke.joke,
    ),
    React.createElement(
      "img",
      {src: "assets/img/thumbdown.png", alt: "thumbs down", className: "dislike", id: "dislike", onClick: dislikeJoke},
    ),
    React.createElement(
      "img",
      {src: "assets/img/thumbup.png", alt: "thumbs up", className: "like", id: "like", onClick: likeJoke},
    )
  );
};

var newJoke = function newJoke(){
  if(allJokes.length !== 0){
    resetLikes();
    loadJokesFromServer();
  }
};

var viewFooter = function viewFooter(){
  return React.createElement(
    "button",
    {className: "nextJoke", onClick: newJoke},
    "Next Joke"
  );
};

//load all the jokes and save them to be used
var loadJokesFromServer = function loadJokesFromServer() {
  sendAjax('GET', '/getAllJokes', null, function (data) {
    allJokes = data.jokes;
    
    //console.log(allJokes);
    
    ReactDOM.render(React.createElement(dadJoke), document.querySelector("#jokeView"));
  });
};

var setup = function setup(csrf) {
  loadJokesFromServer();
  
  ReactDOM.render(React.createElement(viewFooter), document.querySelector("#jokeScroll"));
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
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
