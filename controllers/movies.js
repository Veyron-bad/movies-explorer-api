const { default: mongoose } = require('mongoose');
const Movie = require('../model/movie');
const { CREATED } = require('../utils/resStatus');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const ErrorBadRequest = require('../errors/errorBadRequest');

const { ValidationError, CastError } = mongoose.Error;

// Получаем массив всех фильмов
const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movie) => res.send(movie))
    .catch(next);
};

// Создаем фильма
const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorBadRequest('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

// Удаление фильма
const deleteMovies = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        return next(new ErrorNotFound('Фильм не найдена'));
      }
      // Проверям пренадлежность фильма текущему пользователю
      if (movie.owner.valueOf() === req.user._id) {
        movie.deleteOne()
          .then(() => {
            res.send({ message: 'Фильм удален' });
          })
          .catch(next);
      } else {
        next(new ErrorForbidden('Необходимо авторизоваться'));
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new ErrorBadRequest('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
