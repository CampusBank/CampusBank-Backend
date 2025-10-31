const User = require('../models/User')
const Transaction = require('../models/Transaction')

exports.teste = function (req, res) {
    res.json({
        mensagem: "ta protegidinho",
        user: req.user
    })
}

exports.createKey = async (req, res) => {
    try {
        const userId = req.user.id
        const { type, key } = req.body

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    pixKey: {
                        type,
                        key,
                        verified: true,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        res.status(200).json({
            message: "Chave Pix adicionada com sucesso!",
            user,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao adicionar chave Pix" });
    }
}

exports.sendPix = async (req, res) => {
    try {
        const sender = await User.findById(req.user.id);
        const { chavePix, typePix, valor } = req.body;

        const receiver = await User.findOne({ "pixKey.key": chavePix });

        if (!receiver) {
            return res.status(404).json({ mensagem: "Chave Pix não encontrada." });
        }

        if (sender.saldo < valor) {
            return res.status(400).json({ mensagem: "ta achando que a vida é um morango 🍓 (saldo insuficiente)" });
        }

 
        sender.saldo -= valor;
        receiver.saldo += valor;

        await sender.save();
        await receiver.save();


        const transaction = await Transaction.create({
            sender: sender._id,
            receiver: receiver._id,
            pixType: typePix,
            pixKey: chavePix,
            valor: valor,
            status: 'concluída',
            createdAt: Date.now()
        });

      
        return res.status(201).json({
            mensagem: "Transação feita com sucesso!",
            transaction
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao processar transação." });
    }
}

