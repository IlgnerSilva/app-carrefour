const slugURL = require('slug');
class Querys{
    constructor(Posts){
        this.Posts = Posts
    };

    getBuscaTodos(){
        return new Promise((resolve, reject)=>{
            this.Posts.find({}).sort({ '_id': -1 }).exec((err, posts) => {
                const postagem = posts.map((val)=>{
                    return {
                        id: val._id,
                        tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                        urlImagem: val.url_imagem,
                        slug: val.slug,
                        precoProduto: val.preco_produto
                    }
                });
                if(err){
                    reject(`Sem conexão com o banco de dados ${err}`)
                }else{
                    resolve(postagem)
                }
            })
            
        })
    }
    getBuscaUltimosAdd(){
        return new Promise((resolve, reject)=>{
            this.Posts.find({}).sort({ '_id': -1 }).limit(5).exec((err, posts) => {
                const postagem = posts.map((val)=>{
                    return {
                        id: val._id,
                        tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                        urlImagem: val.url_imagem,
                        slug: val.slug,
                        precoProduto: val.preco_produto
                    }
                });
                if(err){
                    reject(`Sem conexão com o banco de dados ${err}`)
                }else{
                    resolve(postagem)
                }
            })
            
        })
    }
    getBuscaPeloInput(query){
        return new Promise((resolve, reject)=>{
            this.Posts.find(query, (err, post)=>{
                const postagem = post.map((val)=>{
                    return {
                        tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                        urlImagem: val.url_imagem,
                        slug: val.slug,
                        precoProduto: val.preco_produto
                    }
                });
                if(err){
                    reject(`Não foi possivel encontrar nenhum produto ${err}`)
                }else{
                    resolve(postagem)
                }
            })
        })
    }
    getSingleProduto(slug, inc, novo){
        return new Promise((resolve, reject)=>{
            this.Posts.findOneAndUpdate(slug, inc, novo, (err, resposta)=>{
                if(err){
                    reject(`Não foi possivel encontrar nenhum produto ${err}`)
                }else{
                    resolve(resposta)
                }
            });
        });
    }
    postAdicionaProdutos(titulo, marca, url, descricao, preco, parcelas, categoria){
        return new Promise((resolve, reject)=>{
            this.Posts.create({
                titulo_produto: titulo,
                marca: marca,
                url_imagem: url,
                descricao_produto: descricao,
                slug: slugURL(titulo),
                preco_produto: preco,
                max_qtd_parcelas: parcelas,
                categoria: slugURL(categoria),
                views: 0
            }, (err, res)=>{
                if(err){
                    reject(`Não foi possível adicionar nenhum produto ${err}`)
                }else{
                    resolve('Produto adiconado')
                }
            });
        });
    }
    getMaisVisualizados(){
        return new Promise((resolve, reject)=>{
            this.Posts.find({}).sort({ 'views': -1 }).limit(5).exec((err, maisVistos)=>{
                const views = maisVistos.map((val)=>{
                    return {
                        tituloProdutoCurto: val.titulo_produto.substr(0, 50),
                        urlImagem: val.url_imagem,
                        slug: val.slug,
                        precoProduto: val.preco_produto,
                        view: val.views
                    }
                });
                if(err){
                    reject(`Não foi possivel encontrar as views`)
                }else{
                    resolve(views)
                }
            })
        })
    }
}
module.exports = Querys;