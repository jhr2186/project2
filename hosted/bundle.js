"use strict";

var handleJoke = function handleJoke(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#jokeName").val() == '') {
    handleError("Wurst Joke Ever!");
    return false;
  }

  sendAjax('POST', $("#jokeForm").attr("action"), $("#jokeForm").serialize(), function () {
    loadJokesFromServer();

    document.querySelector("#jokeForm").reset();
  });

  return false;
};

var JokeForm = function JokeForm(props) {
  return React.createElement(
    "form",
    { id: "jokeForm",
      onSubmit: handleJoke,
      name: "jokeForm",
      action: "/maker",
      method: "POST",
      className: "jokeForm"
    },
    React.createElement(
      "label",
      { htmlFor: "joke" },
      "Joke: "
    ),
    React.createElement("input", { id: "jokeName", type: "text", name: "joke", placeholder: "Bad Dad joke" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeJokeSubmit", type: "submit", value: "Create Joke" })
  );
};

var JokeList = function JokeList(props) {
  if (props.jokes.length === 0) {
    return React.createElement(
      "div",
      { className: "jokeList" },
      React.createElement(
        "h3",
        { className: "emptyJoke" },
        "No horrible Dad Jokes yet"
      )
    );
  }

  var jokeNodes = props.jokes.map(function (jokes) {
    return React.createElement(
      "div",
      { "let": jokes._id, className: "joke" },
      React.createElement(
        "h3",
        { className: "jokePunch" },
        "Joke: ",
        jokes.joke
      ),
      React.createElement(
        "h3",
        { className: "jokeScore" },
        jokes.score
      )
    );
  });

  return React.createElement(
    "div",
    { className: "jokeList" },
    jokeNodes
  );
};

var DisplayAd = function DisplayAd() {
  return React.createElement("img", { src: "assets/img/ad.jpg", alt: "ad", className: "ad" });
};

var loadJokesFromServer = function loadJokesFromServer() {
  sendAjax('GET', '/getJokes', null, function (data) {
    ReactDOM.render(React.createElement(JokeList, { jokes: data.jokes }), document.querySelector("#jokes"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(JokeForm, { csrf: csrf }), document.querySelector("#makeJoke"));

  ReactDOM.render(React.createElement(JokeList, { jokes: [] }), document.querySelector("#jokes"));

  ReactDOM.render(React.createElement(DisplayAd, null), document.querySelector("#mainFooter"));

  loadJokesFromServer();
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
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
