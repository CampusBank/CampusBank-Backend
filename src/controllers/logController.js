const User = require('../models/User')
const Transaction = require('../models/Transaction')

exports.teste = function (req, res) {
    res.json({
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

exports.checkKey = async (req, res) => {
    const { key } = req.body

    const user = await User.findOne({ "pixKey.key": key })
    if (!user) return res.status(404).json({ mensagem: "Chave Pix não encontrada." });

    res.status(200).json({
        nome: user.nome,
        score: user.score < 60 ? 'Este usuário tem um score de confiança baixa' : 'ta deboinha'
    })
}

exports.sendPix = async (req, res) => {
  try {
    const sender = await User.findById(req.user.id);
    const { chavePix, valor } = req.body;

    
    const receiver = await User.findOne({ "pixKey.key": chavePix });

    if (!receiver) {
      return res.status(404).json({ mensagem: "Chave Pix não encontrada." });
    }

   
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        mensagem: "Você não pode enviar PIX para si mesmo!"
      });
    }

    
    const chaveEncontrada = receiver.pixKey.find(pix => pix.key === chavePix);
    const typePix = chaveEncontrada?.type || 'desconhecida';

    
    if (sender.saldo < valor) {
      return res.status(400).json({
        mensagem: "ta achando que a vida é um morango 🍓 (saldo insuficiente)"
      });
    }

    // Atualizar saldos
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
};


exports.listTransaction = async (req, res) => {
    try {
        const idUser = req.user.id;

        const transacoes = await Transaction.find({
            $or: [
                { sender: idUser },
                { receiver: idUser }
            ]
        })
        .populate("sender", "nome email")      // pega nome e email do remetente
        .populate("receiver", "nome email");   // pega nome e email do destinatário

        if (!transacoes || transacoes.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma transação encontrada.' });
        }

        return res.status(200).json(transacoes);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao encontrar transações." });
    }
};


