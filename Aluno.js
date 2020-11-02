class Aluno {

    constructor(dao) {
        this.dao = dao;
    }

    dropTable() {
        return this.dao.run(`DROP TABLE aluno`);
    }

    createTable() {
        return this.dao.run(
            `CREATE TABLE IF NOT EXISTS aluno (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rga TEXT NOT NULL,
                nome TEXT NOT NULL,
                curso TEXT,
                situacao TEXT,
                registrado_em TEXT
            )`
        );
    }

    inserirAluno(aluno) {

        const { rga, nome, curso } = aluno;
        
        this.dao.run(
            `INSERT INTO aluno (rga, nome, curso, situacao, registrado_em) VALUES (?, ?, ?, 'ativo', CURRENT_DATE)`,
            [
                rga,
                nome,
                (curso === undefined) ? NULL : curso,
            ]
        );

        return this.dao.get(
            `SELECT * FROM aluno ORDER BY id DESC`
        );
    }

    listarAlunos(limite, pagina, nome) {

        const _limite = isNaN(limite) ? 25 : limite;
        const _pagina = isNaN(pagina) ? 1 : pagina;

        if (!isNaN(nome)) {
            return this.dao.all(
                `SELECT * FROM aluno WHERE nome = ? LIMIT ? OFFSET ?`,
                [
                    nome,
                    _limite,
                    ((_pagina - 1) * _limite)
                ]
            );
        } else {
            return this.dao.all(
                `SELECT * FROM aluno LIMIT ? OFFSET ?`,
                [
                    _limite,
                    ((_pagina - 1) * _limite)
                ]
            );
        }
    }

    selecionarAluno(id) {
        return this.dao.get(`SELECT * FROM aluno WHERE id = ?`, [id]);
    }

    atualizarAluno(aluno) {

        const { id, rga, nome, curso, situacao } = aluno;

        this.dao.run(
            `UPDATE aluno SET rga = ?, nome = ?, curso = ?, situacao = ? WHERE id = ?`,
            [
                rga,
                nome,
                curso,
                situacao,
                id
            ]
        );

        return this.selecionarAluno(id);
    }
    
    deletarAluno(id) {
        return this.dao.run(`DELETE FROM aluno WHERE id = ?`, [id]);
    }
}
  
module.exports = Aluno;