const models = require('../models');

const Joke = models.Joke;

const makerPage = (req, res) => {
  Joke.JokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), jokes: docs });
  });
};

const getJokePage = (req, res) => {
  Joke.JokeModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: 'An error occured' });
    }

    return res.render('jokes', { csrfToken: req.csrfToken(), jokes: docs });
  });
};

const aboutPage = (req, res) => res.render('about', { csrfToken: req.csrfToken() });

const getJokes = (request, response) => {
  const req = request;
  const res = response;

  return Joke.JokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ jokes: docs });
  });
};

const getAllJokes = (request, response) => {
  const res = response;

  return Joke.JokeModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ jokes: docs });
  });
};

const makeJoke = (req, res) => {
  if (!req.body.joke) {
    console.log(req.body);
    return res.status(400).json({ error: 'Wurst joke ever!' });
  }

  const jokeData = {
    joke: req.body.joke,
    score: 0,
    owner: req.session.account._id,
  };

  const newJoke = new Joke.JokeModel(jokeData);

  const jokePromise = newJoke.save();

  jokePromise.then(() => res.json({ redirect: '/maker' }));

  jokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already cracked this joke' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return jokePromise;
};

//update scores of jokes based on likes
const UpdateJokeScore = (req, res) => Joke.JokeModel.findByName(req.body._id, (err, doc) => {
  if (err) {
    return res.json({ err });
  }

  if (!doc) {
    return res.json({ error: 'No jokes found' });
  }
  
  const newJoke = doc;
  
  const num = newJoke.score + parseInt(req.body.score);
  
  newJoke.score = num;
  
  const savePromise = newJoke.save();

  savePromise.then(() => res.json({_id: newJoke._id, joke: newJoke.joke, score: newJoke.score }));

  savePromise.catch(err);
  
  return savePromise;
});

module.exports.makerPage = makerPage;
module.exports.getJokePage = getJokePage;
module.exports.aboutPage = aboutPage;
module.exports.getJokes = getJokes;
module.exports.getAllJokes = getAllJokes;
module.exports.make = makeJoke;
module.exports.updateScore = UpdateJokeScore;
