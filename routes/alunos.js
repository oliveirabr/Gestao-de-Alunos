const express = require('express');
const router = express.Router();

//const Promise = require('bluebird');
const AppDAO = require('../AppDAO');
const Aluno = require('../Aluno');
const dao = new AppDAO('./database.sqlite3');
const alunoBanco = new Aluno(dao);


//aluno.dropTable(); É melhor excluir o arquivo database.sqlite3
alunoBanco.createTable();

router.get('/', (req, res, next) => {

    const todosAlunos = alunoBanco.ListarAlunos();

    //arrumar a visualização
    res.status(200).send({
        mensagem: 'Informações de todos os alunos!',
        alunos: todosAlunos
    });
});

router.get('/:id_aluno', (req, res, next) => {
    const id = req.params.id_aluno;

    alunoSelecionado = alunoBanco.SelecionaAluno(id);
    console.log(alunoSelecionado);

    //arrumar a visualização
    res.status(200).send({
        mensagem: 'Informações de um aluno específico',
        aluno: alunoSelecionado
    });
});

router.post('/', (req, res, next) => {
    const aluno = {
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso,
        situacao: req.body.situacao,
        registrado_em: req.body.registrado_em
    }

    alunoBanco.InsereAluno(aluno);
    
    res.status(201).send({
        mensagem: 'O aluno foi inserido!',
        aluno: aluno
    });
});

router.put('/:id_aluno', (req, res, next) => {
    //A ideia desse é que sejam enviados todos os dados para serem atualizado
    //em vez de mandar apenas um unico dado.
    const id = req.params.id_aluno;
    const alunoAtualizado = alunoBanco.SelecionaAluno(id);

    const alunoAtualizado = {
        id: id,
        rga: alunoAtualizado.rga,
        nome: alunoAtualizado.nome,
        curso: alunoAtualizado.curso,
        situacao: alunoAtualizado.situacao,
        registrado_em: alunoAtualizado.registrado_em
    }

    //arrumar a visualização
    alunoBanco.AtualizarAluno(alunoAtualizado);
    
    alunoAtualizado = alunoBanco.SelecionaAluno(id);
    
    res.status(201).send({
        mensagem: 'O aluno foi atualizado!',
        aluno: alunoAtualizado
    });
});

router.delete('/:id_aluno', (req, res, next) => {
    const id = req.params.id_aluno;
    const alunoDeletado = alunoBanco.SelecionaAluno(id);
    
    alunoBanco.DeletarAluno(id);
    
    //arrumar a visualização
    res.status(201).send({
        mensagem: 'O aluno foi deletado!',
        aluno: alunoDeletado
    });
});

module.exports = router;