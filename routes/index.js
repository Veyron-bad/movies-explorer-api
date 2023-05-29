const rootRoute = require('express').Router();
const signupRoute = require('./signup');
const signinRoute = require('./signin');
const signoutRoute = require('./signout');
const routerMovies = require('./movies');
const routerUsers = require('./users');
const auth = require('../middlewarez/auth');
const ErrorNotFound = require('../errors/errorNotFound');
const { messagePageNotFound } = require('../utils/errorMessage');

rootRoute.use('/signup', signupRoute);
rootRoute.use('/signin', signinRoute);

rootRoute.use(auth);
rootRoute.use('/users', routerUsers);
rootRoute.use('/movies', routerMovies);
rootRoute.use('/signout', signoutRoute);
rootRoute.use('*', (req, res, next) => {
  next(new ErrorNotFound(messagePageNotFound));
});

module.exports = rootRoute;
