const express = require('express');
const route = express.Router();
const userController = require('./src/controllers/userController')
const logController = require('./src/controllers/logController')
const denController = require('./src/controllers/DenController')

const tokenMiddleware = require('./src/middlewares/authToken')

//Rotas de login e cadastro do usuario
route.post('/register', userController.cadastro)
route.post('/login', userController.login)

//Rotas de Cria chave pix e enviar
route.post('/createkey',tokenMiddleware.authToken, logController.createKey)
route.post('/checkKey', tokenMiddleware.authToken, logController.checkKey)
route.post('/sendPix', tokenMiddleware.authToken ,logController.sendPix)

//Rota transação

route.get('/listTransacoes', tokenMiddleware.authToken, logController.listTransaction)

//Rota de Criar Denuncia
route.post('/criarDenuncia', tokenMiddleware.authToken, denController.criarDenuncia)

//Rotas do admin
route.get('/listarDenuncias', tokenMiddleware.authToken ,tokenMiddleware.isAdm, denController.listarDenuncia)
route.put('/atualizarDenuncias',tokenMiddleware.authToken, tokenMiddleware.isAdm, denController.atualizarDenuncia)

route.get('/protegido', tokenMiddleware.authToken ,logController.teste)


module.exports = route