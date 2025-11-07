const Denuncia = require('../models/Denuncia')
const User = require("..//models/User")

exports.criarDenuncia = async(req, res) =>{
    try {
        const {tipo, descricao, transacao} = req.body

        const denuncia =  await Denuncia.create({
            user: req.user.id,
            tipo,
            descricao,
            transacao
        })

        if(!denuncia) return res.status(400).json({mensagem: "error ao criar denuncia"})

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

exports.atualizarDenuncia = async (req, res) => {
    try {
        const { idDenun, status } = req.body;

  
        const denuncia = await Denuncia.findById(idDenun).populate('transacao');
        if (!denuncia) {
            return res.status(404).json({ mensagem: "Denúncia não encontrada." });
        }

        
        denuncia.status = status;
        await denuncia.save();


        if (status === 'resolvida' && denuncia.transacao) {
            const transacao = denuncia.transacao;
            const usuarioDenunciado = await User.findById(transacao.receiver);

            if (usuarioDenunciado) {
                usuarioDenunciado.score = usuarioDenunciado.score - 10; 
                await usuarioDenunciado.save();
            }
        }

        return res.json({ mensagem: 'Denúncia atualizada com sucesso!' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar denúncia.' });
    }
};


 