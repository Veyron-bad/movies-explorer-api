require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const limiter = require('./middlewarez/limiter');

const handlerCors = require('./middlewarez/cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

const rootRoute = require('./routes/index');
const handlerError = require('./middlewarez/handlerError');
const { requestLogger, errorLogger } = require('./middlewarez/logger');

const { MONGO_URL } = require('./config');

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

app.use(handlerCors);

app.use(requestLogger);

app.use(limiter);
app.use(helmet());

const { PORT } = require('./config');

app.use('/', rootRoute);

app.use(errorLogger);

app.use(errors());
app.use(handlerError); // Централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
