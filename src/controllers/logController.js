exports.teste = function(req,res){
    res.json({
        mensagem: "ta protegidinho",
        user: req.user
    })
}