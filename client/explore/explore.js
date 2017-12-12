let allJokes = null;
let jokeIndex = -1;
let firstLike = true;
let csrfToken = "";

const randomColor = () => {
  const letters = '56789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)];
  }
  
  return color;
};

//set thumbs back to normal
const resetLikes = () => {
  firstLike = true;
  
  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "";
};

//like the joke
const likeJoke = () => {
  const newJoke = allJokes[jokeIndex];
  let change = 0;
  
  //check for first likes and double clicks
  if(firstLike){
    firstLike = false;
    change = 1;
  } else if(document.querySelector("#like").style.backgroundColor !== "green") {
    change = 2;
  }
  
  document.querySelector("#like").style.backgroundColor = "green";
  document.querySelector("#dislike").style.backgroundColor = "";
  
  var serialized = `_id=${newJoke._id}&score=${change}&_csrf=${csrfToken}`;
  
  sendAjax("POST", "/updateScore", serialized, ()=>{});
};

//dislike the joke
const dislikeJoke = () => {
  const newJoke = allJokes[jokeIndex];
  let change = 0;
  
  //check for first likes and double clicks
  if(firstLike){
    firstLike = false;
    change = -1;
  } else if(document.querySelector("#dislike").style.backgroundColor !== "red"){
    change = -2;
  }
  
  document.querySelector("#like").style.backgroundColor = "";
  document.querySelector("#dislike").style.backgroundColor = "red";
  
  var serialized = `_id=${newJoke._id}&score=${change}&_csrf=${csrfToken}`;
  
  sendAjax("POST", "/updateScore", serialized, function(){});
};

//get a random Joke
const randomJoke = () => {
  let index = allJokes.length * Math.random();
  
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

const DadJoke = () => {  
  const color = randomColor();
  document.querySelector("#jokeView").style.backgroundColor = color;
  
  //if nobody has made any jokes
  if(allJokes.length === 0){
    return (
      <p className="displayJoke">Nobody has made any jokes yet. That's lamer than my jokes!</p>
    );
  }
  
  const joke = randomJoke();
  
  return (
    <div className="jokeArea">,
      <p className="displayJoke">{joke.joke}</p>
      <img src="assets/img/thumbdown.png" alt="thumbs down" className="dislike" id="dislike" onClick={dislikeJoke}></img>
      <img src="assets/img/thumbup.png" alt="thumbs up" className="like" id="like" onClick={likeJoke}></img>
    </div>
  );
};

const newJoke = () => {
  if(allJokes.length !== 0){
    resetLikes();
    loadJokesFromServer();
  }
};

const setUser = () => {
  const serialized = `owner=${allJokes[jokeIndex].owner}&_csrf=${csrfToken}`;
  
  sendAjax('GET', '/setUser', serialized, function(){});
};

const ViewFooter = () => {
  return (
    <div>
      <button className="viewProfile" onClick={setUser}><a href='/viewProfile'>View Profile</a></button>
      <button className="nextJoke" onClick={newJoke}>Next Joke</button>
    </div>
  );
};

const loadJokesFromServer = () => {
  sendAjax('GET', '/getAllJokes', null, (data) => {
    allJokes = data.jokes;
    
    ReactDOM.render(
      <DadJoke />, 
      document.querySelector("#jokeView")
    );
  });
};

const setup = (csrf) => {
  loadJokesFromServer();
  
  ReactDOM.render(
    <ViewFooter />,
    document.querySelector("#jokeScroll")
  );
  
  csrfToken = csrf;
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  
  console.log("document ready");
});