const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const ErrorMongoose = require('../errors/errorMongoose');
const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorUnauthorized = require('../errors/errUnauthorized');

const { ValidationError } = mongoose.Error;
const { CREATED } = require('../utils/resStatus');
const { NODE_EVN, JWT_SECRET } = require('../config');

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
        return next(new ErrorMongoose('Пользователь с таким email уже зарегистирован'));
      } if (err instanceof ValidationError) {
        return next(new ErrorBadRequest('Ошибка валидации'));
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
        sameSait: true,
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
        return next(new ErrorUnauthorized('Необходимо авторизоваться'));
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
        next(new ErrorMongoose('Пользователь с таким email уже зарегистрирован'));
      } else if (err instanceof ValidationError) {
        next(new ErrorBadRequest('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

// Выход с приложения
const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Всего хорошего!' });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  registration,
  login,
  logout,
};
