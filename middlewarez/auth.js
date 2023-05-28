const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/errUnauthorized');
const { NODE_EVN, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new ErrorUnauthorized('Необходимо авторизоваться'));
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_EVN === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new ErrorUnauthorized('Необходимо авторизоваться'));
  }

  req.user = payload;

  return next();
};
