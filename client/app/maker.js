const handleJoke = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'}, 350);
  
  if($("#jokeName").val() == '') {
    handleError("Wurst Joke Ever!");
    return false;
  }
  
  sendAjax('POST', $("#jokeForm").attr("action"), $("#jokeForm").serialize(), function() {
    loadJokesFromServer();
  });
  
  return false;
};

const JokeForm = (props) => {
  return (
    <form id="jokeForm"
          onSubmit={handleJoke}
          name="jokeForm"
          action="/maker"
          method="POST"
          className="jokeForm"
      >
      <label htmlFor="jokePunch">Joke: </label>
      <input id="jokeName" type="text" name="joke" placeholder="Bad Dad joke" />
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="makeJokeSubmit" type="submit" value="Create Joke"/>
    </form>
  );
};

const JokeList = function(props) {
  if(props.jokes.length === 0){
    return (
      <div className="jokeList">
        <h3 className="emptyJoke">No horrible Dad Jokes yet</h3>
      </div>
    );
  }
  
  const jokeNodes = props.jokes.map(function(jokes) {
    return (
      <div let={jokes._id} className="joke">
        <h3 className="jokePunch">Joke: {jokes.joke}</h3>
        <h3 className="jokeScore">{jokes.score}</h3>
      </div>
    );
  });
  
  return (
    <div className="jokeList">
      {jokeNodes}
    </div>
  );
};

const DisplayAd = () => {
  return (
    <img src="assets/img/ad.jpg" alt="ad" className="ad"></img>
  );
}

const loadJokesFromServer = () => {
  sendAjax('GET', '/getJokes', null, (data) => {
    ReactDOM.render(
      <JokeList jokes={data.jokes} />,
      document.querySelector("#jokes")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <JokeForm csrf={csrf} />,
    document.querySelector("#makeJoke")
  );
  
  ReactDOM.render(
    <JokeList jokes={[]} />,
    document.querySelector("#jokes")
  );
  
  ReactDOM.render(
    <DisplayAd />,
    document.querySelector("#mainFooter")
  );
  
  loadJokesFromServer();
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