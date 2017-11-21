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

const makeJoke = (req, res) => {
  if (!req.body.joke) {
    console.log(req.body);
    return res.status(400).json({ error: 'Wurst joke ever!' });
  }

  const jokeData = {
    joke: req.body.joke,
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

module.exports.makerPage = makerPage;
module.exports.getJokes = getJokes;
module.exports.make = makeJoke;
