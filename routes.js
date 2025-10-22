const express = require('express');
const route = express.Router();
const userController = require('./src/controllers/userController')

route.post('/register', userController.cadastro)

module.exports = route