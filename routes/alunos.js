const express = require('express');
const router = express.Router();

const AppDAO = require('../AppDAO');
const Aluno = require('../Aluno');
const dao = new AppDAO('./database.sqlite3');
const alunoBanco = new Aluno(dao);

alunoBanco.createTable();

/* GET /alunos */
router.get('/', (req, res, next) => {

    const limite = req.query.limite;
    const limite_int = parseInt(limite);
    const pagina = req.query.pagina;
    const pagina_int = parseInt(pagina);
    const nome = req.query.nome;

    /* se o parâmetro 'limite' estiver presente na consulta, será verificado se este é um inteiro positivo */
    if (limite !== undefined && (isNaN(limite_int) || typeof limite_int !== 'number' || limite_int < 1)) { 
        res.status(400).send({ erro: 'O limite deve ser um número inteiro positivo!' });
        return;
    }

    /* se o parâmetro 'pagina' estiver presente na consulta, será verificado se este é um inteiro positivo */
    if (pagina !== undefined && (isNaN(pagina_int) || typeof pagina_int !== 'number' || pagina_int < 1)) { 
        res.status(400).send({ erro: 'A página deve ser um número inteiro positivo!' });
        return;
    }

    /* se o parâmetro 'nome' estiver presente na consulta, será verificado se este não é uma string vazia */
    if (nome !== undefined && nome === "") { 
        res.status(400).send({ erro: 'O nome deve ser uma string não vazia!' });
        return;
    }

    /* faz a consulta no banco de dados utilizando os parâmetros informados */
    alunoBanco.listarAlunos(limite_int, pagina_int, nome).then(result => {
        res.status(200).send({ alunos: result })
    });
});

/* POST /alunos */
router.post('/', (req, res, next) => {

    const aluno = {
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso
    }

    var formato = /^([\d]{4}\.){2}[\d]{3}-[\d]{1}$/g;

    /* verifica se o rga foi informado */
    if (aluno.rga === undefined) {
        res.status(400).send({ erro: 'O campo \'rga\' é obrigatório!' });
        return;
    }

    /* verifica se rga é do tipo string */
    if (typeof aluno.rga !== 'string') {
        res.status(400).send({ erro: 'O campo \'rga\' deve ser do tipo string!' });
        return;
    }

    /* verifica se o rga obedece o formato definido */
    if (!aluno.rga.match(formato)) {
        res.status(400).send({ erro: 'O campo \'rga\' deve obedecer o formato \'NNNN.NNNN.NNN-N\'!' });
        return;
    }

    /* verifica se o nome foi informado */
    if (aluno.nome === undefined) {
        res.status(400).send({ erro: 'O campo \'nome\' é obrigatório!' });
        return;
    }

    /* verifica se nome é do tipo string */
    if (typeof aluno.nome !== 'string') {
        res.status(400).send({ erro: 'O campo \'nome\' deve ser do tipo string!' });
        return;
    }

    /* verifica se o nome é uma string vazia */
    if (aluno.nome === "") {
        res.status(400).send({ erro: 'O campo \'nome\' não pode ser uma string vazia!' });
        return;
    }

    /* caso o curso foi inserido */
    if (aluno.curso !== undefined) {

        /* verifica se curso é do tipo string */
        if (typeof aluno.curso !== 'string') {
            res.status(400).send({ erro: 'O campo \'curso\' deve ser do tipo string!' });
            return;
        }

        /* verifica se o curso é uma string vazia */
        if (aluno.nome === "") {
            res.status(400).send({ erro: 'O campo \'curso\' não pode ser uma string vazia!' });
            return;
        }
    }

    /* insere um aluno no banco de dados */
    alunoBanco.inserirAluno(aluno).then(result => 
        res.status(201).send({ aluno: result })
    );
});

/* PUT /alunos */
router.put('/', (req, res, next)=> {
    res.status(405).send({
        erro: 'Método não permitido!'
    });
});

/* DELETE /alunos */
router.delete('/', (req, res, next)=> {
    res.status(405).send({
        erro: 'Método não permitido!'
    });
});

/* GET /alunos/<id> */
router.get('/:id', (req, res, next) => {

    const id = req.params.id;

    /* verifica se o id é um número */
    if (isNaN(parseInt(id)) || typeof parseInt(id) !== 'number') {
        res.status(400).send({ erro: 'O id deve ser um número!' });
        return;
    }

    /* verifica se o id é maior ou igual a zero */
    if (parseInt(id) < 0) {
        res.status(400).send({ erro: 'O id deve ser um número maior ou igual a zero!' });
        return;
    }

    /* retorna informações do aluno */
    alunoBanco.selecionarAluno(id).then(result => {
        if (result === undefined) {
            res.status(404).send({ erro: 'Aluno não encontrado!' });
            return;
        }
        res.status(200).send({ aluno: result });
    });
});

/* PUT /alunos/<id> */
router.put('/:id', (req, res, next) => {

    const id = req.params.id;

    /* verifica se o id é um número */
    if (isNaN(parseInt(id)) || typeof parseInt(id) !== 'number') {
        res.status(400).send({ erro: 'O id deve ser um número!' });
        return;
    }

    /* verifica se o id é maior ou igual a zero */
    if (parseInt(id) < 0) {
        res.status(400).send({ erro: 'O id deve ser um número maior ou igual a zero!' });
        return;
    }

    const alunoAtualizado = {
        id: id,
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso,
        situacao: req.body.situacao,
        registrado_em: req.body.registrado_em
    }

    /* verifica se o aluno existe no banco de dados */
    alunoBanco.selecionarAluno(id).then(result => {
        if (result === undefined) {
            res.status(404).send({ erro: 'Aluno não encontrado!' });
            return;
        }
    });

    /* atualiza as informações do aluno */
    alunoBanco.atualizarAluno(alunoAtualizado).then(result => {
        res.status(200).send({ aluno: result });
    });
});

/* DELETE /alunos/<id> */
router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    /* verifica se o id é um número */
    if (isNaN(parseInt(id)) || typeof parseInt(id) !== 'number') {
        res.status(400).send({ erro: 'O id deve ser um número!' });
        return;
    }

    /* verifica se o id é maior ou igual a zero */
    if (parseInt(id) < 0) {
        res.status(400).send({ erro: 'O id deve ser um número maior ou igual a zero!' });
        return;
    }

    /* verifica se o aluno existe no banco de dados e deleta-o */
    alunoBanco.selecionarAluno(id).then(result => {
        if (result === undefined) {
            res.status(404).send({ erro: 'Aluno não encontrado!' });
            return;
        }
        alunoBanco.deletarAluno(id);
        res.status(200).send({ aluno: result });
    });
});

/* POST /alunos/<id> */
router.post('/:id', (req, res, next) => {
    res.status(405).send({
        erro: 'Método não permitido!'
    });
});

module.exports = router;