const AboutPage = () => {
  return(
    <div className="aboutContent">
      <h2 className="aboutHeader">A Horribly-Humored Upbringing</h2>
      <img src="assets/img/MyDad.jpg" alt="My Dad" className="aboutImg"></img>
      <p className="aboutInfo">
        Growing up, my dad was always cracking the worst and most unbearable jokes imaginable.  The older I got, the more I grew to appreciate the cleverness of the jokes, which have come to be known as 'Dad Jokes', and since then I have devoted my life to become the best (or worst, based on perspective) dad imaginable to my future children, but having all the best (or worst) jokes up my sleeve.
      </p>
      <p className="aboutFooter">
        If you would like to assist me in my efforts, you can make a donation 
        <a href="https://venmo.com/Jake-Recoon">here</a>
        .  All donations are appreciated.
      </p>
    </div>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <AboutPage />,
    document.querySelector("#about")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  
  console.log("document ready");
});