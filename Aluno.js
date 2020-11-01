class Aluno {
    constructor(dao) {
      this.dao = dao
    }
  
    dropTable() {
        const sql = `DROP TABLE aluno`
        return this.dao.run(sql);
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS aluno (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rga TEXT NOT NULL,
        nome TEXT NOT NULL,
        curso TEXT,
        situacao TEXT,
        registrado_em TEXT
        )`
      return this.dao.run(sql);
    }

    InsereAluno(aluno) {
        const { rga, nome, curso, situacao, registrado_em } = aluno
        //console.log(rga, nome, curso, situacao, registrado_em);
        return this.dao.run(
          'INSERT INTO aluno (rga, nome, curso, situacao, registrado_em) VALUES (?, ?, ?, ?, ?)',
          [rga, nome, curso, situacao, registrado_em]
          );
    }

    ListarAlunos(){
        //console.log(this.dao.db.all(`SELECT * FROM aluno`))
        return this.dao.all(`SELECT * FROM aluno`);
    }

    SelecionaAluno(id){
        //console.log(id);
        return this.dao.db.get(`SELECT * FROM aluno WHERE id = ?`, [id]);
    }

    AtualizarAluno(aluno) {
        const { rga, nome, curso, situacao, registrado_em, id } = aluno
        return this.dao.run(
          `UPDATE aluno SET rga = ?, nome = ?, curso = ?, situacao = ?, registrado_em = ? WHERE id = ?`,
          [rga, nome, curso, situacao, registrado_em, id]
        );
    }
    
    DeletarAluno(id) {
        return this.dao.run(`DELETE FROM aluno WHERE id = ?`, [id]);
    }
}
  
module.exports = Aluno;