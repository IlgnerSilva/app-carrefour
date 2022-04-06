const express = require('express');
const router = express.Router();
const Posts = require('./../models/Posts');
const slug = require('slug');
const app = require('../../app');

router.get('/', async (req, res) => {
    if (req.query.busca == null) {
        Posts.find({}).sort({ '_id': -1 }).exec((err, posts) => {
            const postagem = posts.map((val) => {
                return {
                    tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                    urlImagem: val.url_imagem,
                    slug: val.slug,
                    precoProduto: val.preco_produto
                }
            })
            res.render('home', { postagem });
        })
        
    } else {
        Posts.find({ titulo_produto: { $regex: req.query.busca, $options: 'i' } }, (err, posts) => {
            if (posts[0] == undefined) {
                res.render('404');
            } else {
                const postagem = posts.map((val) => {
                    return {
                        tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                        urlImagem: val.url_imagem,
                        slug: val.slug,
                        precoProduto: val.preco_produto
                    }
                });
                res.render('busca', { postagem });
            }
        });
    }
});

router.get('/:slug', async (req, res) => {
    Posts.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }, (err, resposta) => {
        console.log(resposta)
        if (resposta == null) {
            res.render('404');
        } else {
            res.render('single', { resposta })
        }
    })
})

const usuarios = [
    {
        login: 'IlgnerSilva',
        senha: 'senha123'
    }
];

router.post('/admin/auth', (req, res) => {
    usuarios.map((val) => {
        if (val.login == req.body.login && val.senha == req.body.senha) {
            req.session.login = 'Administrador'
        }
    });
    res.redirect('/admin/auth');
})

router.post('/admin/cadastro', (req, res) => {
    Posts.create({
        titulo_produto : req.body.tituloProduto,
        marca : req.body.marcaProduto,
        url_imagem : req.body.urlImagem,
        descricao_produto : req.body.descricaoProduto,
        slug : req.body.slug,
        preco_produto : req.body.preco,
        max_qtd_parcelas : req.body.maxQtdParcelas,
        views: 0
    })
    res.send('Cadastro');
})

router.get('/admin/auth', (req, res) => {
    if (req.session.login == null) {
        res.render('admin-login');
    } else {
        res.render('painel-admin');
    }
});


module.exports = app => app.use('/', router);