const routerMovies = require('express').Router();
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');
const { movieCreateValidation, movieDeleteValidation } = require('../middlewarez/validation/validationMovie');

// возвращает все сохранённые текущим  пользователем фильмы
routerMovies.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId

routerMovies.post('/', movieCreateValidation, createMovies);

// удаляет сохранённый фильм по id
routerMovies.delete('/:movieId', movieDeleteValidation, deleteMovies);

module.exports = routerMovies;
