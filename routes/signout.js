const signoutRoute = require('express').Router();
const { logout } = require('../controllers/users');

signoutRoute.post('/', logout);

module.exports = signoutRoute;
