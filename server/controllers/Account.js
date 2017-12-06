const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const passwordPage = (req, res) => {
  res.render('passwordChange', { csrfToken: req.csrfToken() });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;
  
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  
  //both passwords are filled out
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'You need two passwords!' });
  }
  
  //passwords are the same
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords arent the same, bro' });
  }
  
  //if we are here passwords are valid to change
  return Account.AccountModel.findByUsername(req.body.user, (err, doc) => {
    if (err) {
      return res.json({ err });
    }
    
    if (!doc) {
      return res.json({ error: 'User is invalid' });
    }
    
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username: doc.username,
        salt,
        password: hash,
      };

      const newAccount = doc;
      
      newAccount.password = accountData.password;
      newAccount.salt = accountData.salt;

      const savePromise = newAccount.save();

      savePromise.then(() => {
        return res.json({ redirect: '/maker' });
      });

      savePromise.catch((err) => {
        console.log(err);

        return res.status(400).json({ error: 'An error occured' });
      });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passwordPage = passwordPage;
module.exports.changePassword = changePassword;