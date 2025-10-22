const User = require('../models/User')

exports.cadastro = async (req, res) => {

    try {

        const { nome, email, password, cpf, telefone } = req.body

        await User.create({ nome: nome, email: email, password: password, cpf: cpf, telefone: telefone })

        return res.status(201).json({mensagem: 'Usuario Criado com sucesso', user: nome})
    } catch (error) {
        return res.status(400).json({mensagem: 'Tem parada errada ae'})
    }

}