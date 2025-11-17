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

        // Buscar denúncia com transação populada
        const denuncia = await Denuncia.findById(idDenun).populate('transacao');
        if (!denuncia) {
            return res.status(404).json({ mensagem: "Denúncia não encontrada." });
        }

        // Atualiza status
        denuncia.status = status;
        await denuncia.save();

        // Se RESOLVIDA → devolver dinheiro ao usuário e punir golpista
        if (status === 'resolvida' && denuncia.transacao) {

            const transacao = denuncia.transacao;

        
            const sender = await User.findById(transacao.sender);

            
            const receiver = await User.findById(transacao.receiver);

            if (!sender || !receiver) {
                return res.status(400).json({ mensagem: "Usuários envolvidos na transação não encontrados." });
            }

   
            sender.saldo = sender.saldo + transacao.valor;
            await sender.save();

           
            receiver.saldo = receiver.saldo - transacao.valor
            receiver.score = receiver.score - 10;
            await receiver.save();

         
            transacao.status = "falhou";
            await transacao.save();
        }

        return res.json({ mensagem: 'Denúncia atualizada com sucesso!' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar denúncia.' });
    }
};



 