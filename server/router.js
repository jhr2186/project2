const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getJokes', mid.requiresLogin, controllers.Joke.getJokes);
  app.get('/getALLJokes', mid.requiresLogin, controllers.Joke.getAllJokes);
  app.get('/getJokePage', mid.requiresLogin, controllers.Joke.getJokePage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/about', mid.requiresLogin, controllers.Joke.aboutPage);
  app.post('/updateScore', mid.requiresLogin, controllers.Joke.updateScore);
  app.get('/maker', mid.requiresLogin, controllers.Joke.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Joke.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
