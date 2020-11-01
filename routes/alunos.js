const express = require('express');
const router = express.Router();

const AppDAO = require('../AppDAO');
const Aluno = require('../Aluno');
const dao = new AppDAO('./database.sqlite3');
const alunoBanco = new Aluno(dao);

alunoBanco.createTable();

router.get('/', (req, res, next) => {

    const todosAlunos = alunoBanco.ListarAlunos();
    todosAlunos.then(result =>     
        res.status(200).send({
        mensagem: 'Informações de todos os alunos!',
        alunos: result
        })
    );
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    const alunoSelecionado = alunoBanco.SelecionaAluno(id);

    alunoSelecionado.then(result => 
        res.status(200).send({
            mensagem: 'Informações de um aluno específico',
            aluno: result
        })
    );
    
});

router.post('/', (req, res, next) => {
    const aluno = {
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso,
        situacao: req.body.situacao,
        registrado_em: req.body.registrado_em
    }

    const alunoInserido = alunoBanco.InsereAluno(aluno);
    
    alunoInserido.then(result => 
        res.status(201).send({
        mensagem: 'O aluno foi inserido!',
        aluno: result
        })
    )

});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;

    const aluno = {
        id: id,
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso,
        situacao: req.body.situacao,
        registrado_em: req.body.registrado_em
    }

    alunoBanco.AtualizarAluno(aluno);
    
    alunoAtualizado = alunoBanco.SelecionaAluno(id);

    alunoAtualizado.then(result => 
        res.status(201).send({
        mensagem: 'O aluno foi atualizado!',
        aluno: result
        })
    );

});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    const alunoDeletado = alunoBanco.SelecionaAluno(id);
    
    alunoBanco.DeletarAluno(id);
    
    alunoDeletado.then(result =>
        res.status(201).send({
        mensagem: 'O aluno foi deletado!',
        aluno: result
        })
    );
});

module.exports = router;