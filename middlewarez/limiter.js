// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // не больше 100 запросов
});

module.exports = limiter;
