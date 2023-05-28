const signinRoute = require('express').Router();
const { login } = require('../controllers/users');
const { userLoginValidation } = require('../middlewarez/validation/validationUser');

signinRoute.post('/', userLoginValidation, login);

module.exports = signinRoute;
