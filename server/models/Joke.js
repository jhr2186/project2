const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let JokeModel = {};

const convertId = mongoose.Types.ObjectId;
const setJoke = (joke) => _.escape(joke).trim();
// const setScore = () => 0;

const JokeSchema = new mongoose.Schema({
  joke: {
    type: String,
    required: true,
    trim: true,
    set: setJoke,
  },

  score: {
    type: Number,
    required: true,
    trim: true,
    //set: setScore,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

JokeSchema.statics.toAPI = (doc) => ({
  joke: doc.joke,
  score: doc.score,
});

JokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return JokeModel.find(search).select('joke score').exec(callback);
};

JokeSchema.statics.findByName = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return JokeModel.findOne(search, callback);
};

JokeSchema.statics.findAll = (callback) => {
  JokeModel.find().select('joke score').exec(callback);
};

JokeModel = mongoose.model('Joke', JokeSchema);

module.exports.JokeModel = JokeModel;
module.exports.JokeSchema = JokeSchema;
