require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

exports.cadastro = async (req, res) => {
    try {
        const { nome, email, password, cpf, telefone } = req.body

        const passwordHash = bcryptjs.hashSync(password, 10)


        const user = await User.create({ nome: nome, email: email, password: passwordHash, cpf: cpf, telefone: telefone })
        return res.status(201).json({ mensagem: 'Usuario Criado com sucesso', user })

    } catch (error) {
        return res.status(400).json({ mensagem: 'Tem parada errada ae' })
    }
}

exports.login = async(req, res) =>{
    try{
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) return res.status(404).json({ mensagem: 'Usuario nao encontrado' });

        if(!bcryptjs.compareSync(password, user.password)) return res.status(401).json({mensagem: "Senha invalida"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        return res.json({ token })

    } catch(error){
        return res.status(400).json({ mensagem: 'Tem parada errada ae' })
    }
}