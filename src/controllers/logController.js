const User = require('../models/User')

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

exports.sendPix = async(req,res)=>{
    

    const user = await User.findOne({ "pixKey.key": chave });
}

