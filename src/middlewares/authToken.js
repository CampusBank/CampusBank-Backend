require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User')

exports.authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(403).json({ mensagem: 'deu errado mano' });

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)
        if (!user) return res.status(404).json({ mensagem: 'usuário não encontrado' });

        req.user = user
        next()

    } catch (err) {
        console.error(err);
        return res.status(403).json({ mensagem: 'token inválido ou expirado' });
    }

}

exports.isAdm = (req, res, next) =>{
    if(req.user && req.user.role === "admin"){
       return next()
    }
    return res.status(403).json({ mensagem: 'Acesso negado. Somente administradores podem acessar esta rota.' })
}
