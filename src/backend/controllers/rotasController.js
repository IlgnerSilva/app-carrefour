const express = require('express');
const router = express.Router();
const Posts = require('./../models/Posts');
const Querys = require('./../models/Querys')
const query = new Querys(Posts)
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const resposta = req.session.login;
        if (req.query.busca == null) {
            const postagem = await query.getBuscaUltimosAdd();
            const views = await query.getMaisVisualizados()
            res.render('home', { postagem, views, resposta });
        } else {
            const postagem = await query.getBuscaPeloInput({ titulo_produto: { $regex: req.query.busca, $options: 'i' } })
            if (postagem[0] == undefined) {
                res.render('404', { resposta });
            } else {
                res.render('busca', { postagem, resposta });
            }
        }
    } catch (err) {
        res.render('404', { resposta });
    }
});
router.get('/:slug', async (req, res) => {
    const resposta = req.session.login
    try {
        const respostaSingle = await query.getSingleProduto({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
        if (respostaSingle == null) {
            res.render('404', { resposta });
        } else {
            res.render('single', { respostaSingle, resposta });
        }
    } catch (err) {
        res.render('404', { resposta });
    }
})

router.get('/categoria/:slug', async (req, res) => {
    const resposta = req.session.login;
    const postagem = await query.getBuscaPeloInput({ categoria: req.params.slug })
    if (postagem[0] == undefined) {
        res.render('404', { resposta });
    } else {
        res.render('busca', { postagem, resposta });
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
        const adiciona = await query.postAdicionaProdutos(body.tituloProduto, body.marcaProduto, body.urlImagem, body.descricaoProduto, body.preco, body.maxQtdParcelas, body.select);
        res.redirect(307, '/admin/auth')
    } catch (err) {
        res.send(err);
    }
})

router.get('/admin/deletar/:id', async (req, res) => {
    Posts.deleteOne({ _id: req.params.id }).then(() => res.redirect('/admin/auth'))
})

router.get('/admin/auth', async (req, res) => {
    try {
        const postagem = await query.getBuscaTodos();
        if (req.session.login == "Administrador") {
            res.render('painel-admin', { postagem });
        } else {
            req.session.destroy()
            res.render('admin-login');
        }
    } catch (err) {
        res.send(err);
    }
});

router.post('/auth/login_cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    const resposta = await axios.post('https://apiusuarioscarrefour.herokuapp.com/auth/cadastrar', { nome: nome, email: email, senha, senha }).then((response) => {
        response = 'Usuário cadastrado com sucesso'
        return response
    }).catch((err) => {
        return err.response;
    })
    if (resposta.status === 400) {
        res.render('login-cadastro', { resposta })
    } else {
        res.render('login-cadastro', { resposta })
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, senha } = req.body;
    const resposta = await axios.post('https://apiusuarioscarrefour.herokuapp.com/auth/logar', { email: email, senha, senha }).then((response) => {
        return response.data.usuario
    }).catch((err) => {
        return err.response;
    })
    req.session.login = resposta.nome
    if (resposta.status === 400) {
        res.render('login-cadastro', { resposta })
    } else {
        res.redirect('/')
    }
});

router.get('/auth/login_cadastro', (req, res) => {
    const resposta = '';
    res.render('login-cadastro', { resposta });
});

router.get('/auth/esqueci-minha-senha', async (req, res) => {
    const resposta = ''
    res.render('esqueci-senha', { resposta });
})
router.post('/auth/esqueci-minha-senha', async (req, res) => {
    const { email } = req.body;
    const resposta = await axios.post('https://apiusuarioscarrefour.herokuapp.com/auth/esqueci_senha', { email: email }).then((response) => {
        response = 'Foi enviado um Token para reset de senha para seu E-mail';
        return response;
    }).catch((err) => {
        return err.response;
    })

    if (resposta.status === 400) {
        res.render('esqueci-senha', { resposta })
    } else {
        res.render('esqueci-senha', { resposta })
    }

})

router.post('/auth/reset-senha', async (req, res) => {
    const { email, token, senha } = req.body;
    const resposta = await axios.post('https://apiusuarioscarrefour.herokuapp.com/auth/reset_senha', { email: email, token: token, senha, senha }).then((response) => {
        response = 'Sua senha foi redefinida';
        return response;
    }).catch((err) => {
        return err.response;
    })
    if (resposta.status === 400) {
        res.render('esqueci-senha', { resposta });
    } else {
        res.render('esqueci-senha', { resposta });
    }
})

router.get('/auth/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/');
})
module.exports = app => app.use('/', router);