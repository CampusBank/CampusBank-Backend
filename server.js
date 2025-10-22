require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const routes = require('./routes')

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(()=>
        app.emit('putaqpario')
    )
    .catch((err)=>
        console.error(err)
    );

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)

app.on('putaqpario', () =>{
    app.listen(3000, ()=>{
        console.log('Servidor rodando na porta 3000');
        console.log('Acessar http://localhost:3000');
    });
})