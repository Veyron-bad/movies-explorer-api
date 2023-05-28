const signupRoute = require('express').Router();
const { registration } = require('../controllers/users');
const { userCreateValidation } = require('../middlewarez/validation/validationUser');

signupRoute.post('/', userCreateValidation, registration);

module.exports = signupRoute;
