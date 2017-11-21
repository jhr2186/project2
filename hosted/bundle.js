"use strict";

var handleJoke = function handleJoke(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#joke").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#jokeForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var GetJoke = function GetJoke(props) {
  return React.createElement(
    "form",
    { id: "getJoke",
      onSubmit: handleJoke,
      name: "getJoke",
      action: "/maker",
      method: "POST",
      className: "getJoke"
    },
    React.createElement("input", { className: "randomJoke", type: "submit", value: "Get a random dad joke" })
  );
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
      { htmlFor: "jokePunch" },
      "Joke: "
    ),
    React.createElement("input", { id: "jokeName", type: "text", name: "jokePunch", placeholder: "Bad dad joke" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeJokeSubmit", type: "submit", value: "Create Joke" })
  );
};

var JokeList = function JokeList(props) {
  if (props.jokes.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No horrible Dad Jokes yet"
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { "let": domo._id, className: "joke" },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "dad", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "domoName" },
        "Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        "Age: ",
        domo.age
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { jokes: data.jokes }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GetJoke, { csrf: csrf }), document.querySelector("#getJokes"));
  
  ReactDOM.render(React.createElement(JokeForm, { csrf: csrf }), document.querySelector("#makeJoke"));

  ReactDOM.render(React.createElement(JokeList, { jokes: [] }), document.querySelector("#jokes"));
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
