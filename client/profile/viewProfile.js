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
  sendAjax('GET', '/getJokesByUser', null, (data) => {
    ReactDOM.render(
      <JokeList jokes={data.jokes} />,
      document.querySelector("#jokes")
    );
  });
};

const setup = function(csrf) {
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