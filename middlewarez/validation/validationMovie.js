const { celebrate, Joi } = require('celebrate');
const urlRegExp = require('../../utils/urlRegExp');

const movieCreateValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlRegExp).required(),
    trailerLink: Joi.string().pattern(urlRegExp).required(),
    thumbnail: Joi.string().pattern(urlRegExp).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieDeleteValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  movieCreateValidation,
  movieDeleteValidation,
};
