"use strict";

var AboutPage = function AboutPage() {
  return React.createElement(
    "div",
    { className: "aboutContent" },
    React.createElement(
      "h2",
      { className: "aboutHeader" },
      "A Horribly-Humored Upbringing"
    ),
    React.createElement("img", { src: "assets/img/MyDad.jpg", alt: "My Dad", className: "aboutImg" }),
    React.createElement(
      "p",
      { className: "aboutInfo" },
      "Growing up, my dad was always cracking the worst and most unbearable jokes imaginable.  The older I got, the more I grew to appreciate the cleverness of the jokes, which have come to be known as 'Dad Jokes', and since then I have devoted my life to become the best (or worst, based on perspective) dad imaginable to my future children, but having all the best (or worst) jokes up my sleeve."
    ),
    React.createElement(
      "p",
      { className: "aboutFooter" },
      "If you would like to assist me in my efforts, you can make a donation",
      React.createElement(
        "a",
        { href: "https://venmo.com/Jake-Recoon" },
        "here"
      ),
      ".  All donations are appreciated."
    )
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(AboutPage, null), document.querySelector("#about"));
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
