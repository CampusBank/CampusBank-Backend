const mongoose = require('mongoose')

const DenunciaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    
    tipo: {
        type: String,
        enum: ['fraude', 'golpe', 'transferência suspeita', 'outro'],
        required: true
    },

    descricao: {
        type: String,
        required: true,
        trim: true
    },

    
    transacao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },

  
    status: {
        type: String,
        enum: ['pendente', 'resolvida', 'recusada'],
        default: 'pendente'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const DenunciaModel = mongoose.model('Denuncia', DenunciaSchema)

module.exports = DenunciaModel
