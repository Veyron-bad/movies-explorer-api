const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const ErrorMongoose = require('../errors/errorMongoose');
const ErrorBadRequest = require('../errors/errorBadRequest');

const { ValidationError } = mongoose.Error;
const { CREATED } = require('../utils/resStatus');
const { NODE_EVN, JWT_SECRET } = require('../config');
const ErrorNotFound = require('../errors/errorNotFound');
const { messageErrorDublicationEmail, messageErrorValidation, messageUserNotFound } = require('../utils/errorMessage');
const { messageLogout } = require('../utils/resMessage');

// Регистрация пользователя
const registration = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const response = user.toObject();
      delete response.password;
      res.status(CREATED).send(response);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ErrorMongoose(messageErrorDublicationEmail));
      } if (err instanceof ValidationError) {
        return next(new ErrorBadRequest(messageErrorValidation));
      }
      return next(err);
    });
};

// Авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_EVN === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};

// Получаем инофрмацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new ErrorNotFound(messageUserNotFound));
      }
      return res.send(user);
    })
    .catch(next);
};

// Обновление информации о пользователе имя и email
const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorMongoose(messageErrorDublicationEmail));
      } else if (err instanceof ValidationError) {
        next(new ErrorBadRequest(messageErrorValidation));
      } else {
        next(err);
      }
    });
};

// Выход с приложения
const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }).send({ message: messageLogout });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  registration,
  login,
  logout,
};
