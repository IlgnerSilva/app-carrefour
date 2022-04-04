const mongoose = require('./../database/connection');

const Schema = mongoose.Schema({
    titulo:{
        type: 'string',
        required: true
    },
    image:{
        type: 'string',
        required: true,
    },
    categoria:{
        type: 'string',
        required: true,
    },
    conteudo:{
        type: 'string',
        required: true,
    },
    slug:{
        type: 'string',
        required: true,
        unique: true
    },
    preco:{
        type: 'string',
        required: true,
    },
    views:{
        type: Number
    }
});

const Posts = mongoose.model('Posts', Schema);

module.exports = Posts;