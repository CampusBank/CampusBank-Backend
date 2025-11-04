const Denuncia = require('../models/Denuncia')

exports.criarDenuncia = async(req, res) =>{
    try {
        const {tipo, descricao, transacao} = req.body

        const denuncia =  await Denuncia.create({
            user: req.user.id,
            tipo,
            descricao,
            transacao
        })

        res.status(201).json({
            mensagem: "Denuncia criada com sucesso",
            denuncia
        })
        
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar denúncia.' })
    }
}


exports.listarDenuncia = async(req, res) =>{
    try {
        const denuncia = await Denuncia.find().populate('user', 'nome email').populate('transacao')

        res.json(denuncia)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar denuncias.' })
    }
}

exports.atualizarDenuncia = async(req,res) =>{
    try {
        const {idDenun, status} = req.body

        const denununcia = await Denuncia.findByIdAndUpdate(idDenun).populate('transacao')
        if(!denununcia) return res.json({mensagem: "Denuncia nao encontrada"})
        
        denununcia.status = status

        await denununcia.save()

        if (status === 'aceita') {
           
            const transacao = denununcia.transacao
            const usuarioDenunciado = await User.findById(transacao.receiver);

            if (usuarioDenunciado) {
                usuarioDenunciado.score = usuarioDenunciado.score - 10; 
                await usuarioDenunciado.save();
            }
        }

        res.json({ mensagem: 'Denúncia atualizada com sucesso!' });
        
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar denúncia.' })
    }
}

 