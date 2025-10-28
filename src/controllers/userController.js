require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.cadastro = async (req, res) => {
    try {
        const { nome, email, password, cpf, telefone } = req.body

        await User.create({ nome: nome, email: email, password: password, cpf: cpf, telefone: telefone })
        return res.status(201).json({ mensagem: 'Usuario Criado com sucesso', user: nome })

    } catch (error) {
        return res.status(400).json({ mensagem: 'Tem parada errada ae' })
    }
}

exports.login = async(req, res) =>{
    try{
        const {email, password} = req.body

        const user = await User.findOne({email, password})
        if (!user) return res.status(401).json({ mensagem: 'credenciais inválidas' });

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        return res.json({ token })

    } catch(error){
        return res.status(400).json({ mensagem: 'Tem parada errada ae' })
    }
}