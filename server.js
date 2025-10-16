require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(()=>
        app.emit('putaqpario')
    )
    .catch((err)=>
        console.error(err)
    );

app.on('putaqpario', () =>{
    app.listen(3000, ()=>{
        console.log('Servidor rodando na porta 3000');
        console.log('Acessar http://localhost:3000');
    });
})