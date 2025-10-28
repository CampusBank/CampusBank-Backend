const express = require('express');
const route = express.Router();
const userController = require('./src/controllers/userController')
const logController = require('./src/controllers/logController')

const tokenMiddleware = require('./src/middlewares/authToken')

route.post('/register', userController.cadastro)
route.post('/login', userController.login)

route.post('/createkey',tokenMiddleware.authToken, logController.createKey)

route.get('/protegido', tokenMiddleware.authToken ,logController.teste)


module.exports = route