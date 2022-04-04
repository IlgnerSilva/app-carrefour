const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require('./../models/Posts');

router.get('/', async (req, res) => {
    if (req.query.busca == null) {
        await Posts.find({}).sort({ '_id': -1 }).exec((err, posts) => {
            posts = posts.map((val) => {
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0, 100),
                    image: val.image,
                    slug: val.slug,
                    categoria: val.categoria,
                    preco: val.preco
                }
            })
            res.render('home', { posts: posts });
        })

    } else {
        Posts.find({titulo: {$regex: req.query.busca, $options: 'i'}}, (err, posts)=>{
            res.render('busca', {posts: posts});
        })
    }
})

router.get('/:slug', async (req, res) => {
    await Posts.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }, (err, resposta) => {
        res.render('single', { resposta })
    })
})

module.exports = app => app.use('/', router);