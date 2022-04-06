const Posts = require('./../models/Posts');

class Querys{
    constructor(dados){
        this.titulo_produto = dados.tituloProduto
        this.marca = dados.marcaProduto
        this.url_imagem = dados.urlImagem
        this.descricao_produto = dados.descricaoProduto
        this.slug = dados.slug
        this.preco_produto = dados.preco
        this.max_qtd_parcelas = dados.maxQtdParcelas
    }
}

module.exports = Querys;