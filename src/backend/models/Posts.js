const mongoose = require('./../database/connection');

const Schema = mongoose.Schema({
    titulo_produto:{
        type: 'string',
        required: true
    },
    marca:{
        type: 'string',
        required: true
    },
    url_imagem:{
        type: 'string',
        required: true,
    },
    descricao_produto:{
        type: 'string',
        required: true,
    },
    slug:{
        type: 'string',
        required: true,
        unique: true
    },
    preco_produto:{
        type: 'string',
        required: true,
    },
    max_qtd_parcelas:{
        type: 'string',
        required: true,
    },
    categoria:{
        type: 'string',
        required: true,
    },
    views:{
        type: Number
    }
});

const Posts = mongoose.model('Posts', Schema);

module.exports = Posts;