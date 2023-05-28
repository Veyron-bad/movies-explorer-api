const routerUsers = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { userUpdateValidation } = require('../middlewarez/validation/validationUser');

// возвращает информацию о пользователе (email и имя)
routerUsers.get('/me', getUserInfo);

// обновляет информацию о пользователе (email и имя)
routerUsers.patch('/me', userUpdateValidation, updateUserInfo);

module.exports = routerUsers;
