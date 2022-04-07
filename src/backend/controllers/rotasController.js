const express = require('express');
const router = express.Router();
const Posts = require('./../models/Posts');
const slug = require('slug');
const Querys = require('./../models/Querys')
const query = new Querys(Posts)

router.get('/', async (req, res) => {
    try {
        if (req.query.busca == null) {
            const postagem = await query.getBuscaTodos();
            const views = await query.getMaisVisualizados()
            res.render('home', { postagem, views });
        } else {
            const postagem = await query.getBuscaPeloInput({ titulo_produto: { $regex: req.query.busca, $options: 'i' } })
            if (postagem[0] == undefined) {
                res.render('404');
            } else {
                res.render('busca', { postagem });
            }
        }
    } catch (err) {
        res.render('404');
    }
});
router.get('/:slug', async (req, res) => {
    try {
        const resposta = await query.getSingleProduto({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true })
        if (resposta == null) {
            res.render('404');
        } else {
            res.render('single', { resposta })
        }
    } catch (err) {
        res.render('404');
    }
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
            req.session.login = 'Administrador';
        }
    });
    res.redirect('/admin/auth');
})

router.post('/admin/cadastro', async (req, res) => {
    try {
        const body = req.body;
        const adiciona = await query.postAdicionaProdutos(body.tituloProduto, body.marcaProduto, body.urlImagem, body.descricaoProduto, body.preco, body.maxQtdParcelas);
        res.redirect(`/${adiciona.slug}`);
    } catch (err) {
        res.send(err);
    }
})

router.get('/admin/auth', (req, res) => {
    try{
        if (req.session.login == null) {
            res.render('admin-login');
        } else {
            res.render('painel-admin');
        }
    }catch(err){
        res.send(err);
    }
});


module.exports = app => app.use('/', router);