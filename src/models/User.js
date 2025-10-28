const mongoose = require('mongoose');

const UserShema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    saldo: { type: Number, default: 1000 },
    pixKey: [
        {
            type: {
                type: String,
                enum: ['email', 'cpf', 'telefone', 'aleatoria'],
            },
            key: {
                type: String,
            },
            verified: {
                type: Boolean,
                default: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    criadoEm: { type: Date, default: Date.now }
})


const UserModel = mongoose.model('User', UserShema)

module.exports = UserModel