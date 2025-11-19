const express = require('express');
const cors = require('cors');
const mysql = require('mysql'); // Certifique-se de ter instalado: npm install mysql
require('dotenv').config();

const app = express();

// Configurações Básicas
app.use(cors());
app.use(express.json()); // Essencial para ler o JSON enviado pelo React

// Conexão com o Banco de Dados
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Karolinne10", // Sua senha
    database: "sysenfermagem" // Seu banco
});

// Teste de conexão ao iniciar (Opcional, mas bom pra debug)
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erro ao conectar no MySQL:", err.code);
    } else {
        console.log("✅ Conectado ao MySQL com sucesso!");
        connection.release();
    }
});

// --- ROTAS ---

// Rota de Teste Simples
app.get("/", (req, res) => {
    res.send("Servidor do SysEnfermagem rodando perfeitamente!");
});

// ROTA PRINCIPAL: Cadastrar Professor
app.post('/professores', (req, res) => {
    const { nome, email, cpf } = req.body;

    // 1. Validação no Backend (Segurança extra)
    if (!nome || !email || !cpf) {
        return res.status(400).json({ error: "Nome, Email e CPF são obrigatórios." });
    }

    const sql = "INSERT INTO professores (nome, email, cpf) VALUES (?, ?, ?)";

    db.query(sql, [nome, email, cpf], (err, result) => {
        if (err) {
            // Tratamento de Erro: Duplicidade
            if (err.code === 'ER_DUP_ENTRY') {
                // Verifica se o erro foi no Email ou no CPF
                const msg = err.sqlMessage.includes('email') 
                    ? "Este E-mail já está cadastrado." 
                    : "Este CPF já está cadastrado.";
                return res.status(409).json({ error: msg });
            }
            
            // Outros erros
            console.error(err);
            return res.status(500).json({ error: "Erro interno no banco de dados." });
        }

        // Sucesso
        res.status(201).json({ 
            message: "Professor cadastrado com sucesso!", 
            id: result.insertId 
        });
    });
});

// ROTA: LISTAR TODOS OS PROFESSORES
app.get('/professores', (req, res) => {
    const sql = "SELECT * FROM professores ORDER BY nome ASC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar professores." });
        }
        res.json(results);
    });
});

// --- ROTAS DE ALUNOS ---

// 1. LISTAR ALUNOS
app.get('/alunos', (req, res) => {
    const sql = "SELECT * FROM alunos ORDER BY nome ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar alunos." });
        }
        res.json(results);
    });
});

// 2. CADASTRAR ALUNO
// 2. CADASTRAR ALUNO (Alterado para CPF)
app.post('/alunos', (req, res) => {
    // Agora esperamos CPF no lugar de matricula
    const { nome, cpf, data_nascimento } = req.body;

    if (!nome || !cpf) {
        return res.status(400).json({ error: "Nome e CPF são obrigatórios." });
    }

    // SQL atualizado
    const sql = "INSERT INTO alunos (nome, cpf, data_nascimento) VALUES (?, ?, ?)";

    db.query(sql, [nome, cpf, data_nascimento || null], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Este CPF já está cadastrado." });
            }
            return res.status(500).json({ error: "Erro ao cadastrar aluno." });
        }
        res.status(201).json({ message: "Aluno cadastrado com sucesso!", id: result.insertId });
    });
});


// ROTA: LISTAR TURMAS (COM NOME DO CURSO)
app.get('/turmas', (req, res) => {
    const sql = `
        SELECT t.*, c.nome as nome_curso, c.sigla as sigla_curso 
        FROM turmas t 
        JOIN cursos c ON t.curso_id = c.id 
        ORDER BY t.id DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar turmas." });
        }
        res.json(results);
    });
});

// --- ROTAS DE TURMAS E CURSOS ---

// 1. LISTAR CURSOS (Para o Dropdown)
app.get('/cursos', (req, res) => {
    const sql = "SELECT * FROM cursos WHERE ativo = 1 ORDER BY nome ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar cursos." });
        res.json(results);
    });
});

// 2. CADASTRAR TURMA
app.post('/turmas', (req, res) => {
    const { curso_id, codigo, periodo, turno, data_inicio, data_fim } = req.body;

    if (!curso_id || !codigo || !periodo) {
        return res.status(400).json({ error: "Preencha os campos obrigatórios." });
    }

    const sql = `
        INSERT INTO turmas (curso_id, codigo, periodo, turno, data_inicio, data_fim) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [curso_id, codigo, periodo, turno, data_inicio, data_fim], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao criar turma." });
        }
        res.status(201).json({ message: "Turma aberta com sucesso!", id: result.insertId });
    });
});

// --- ROTAS DE MATRÍCULA ---

// 1. REALIZAR MATRÍCULA (Vincular Aluno na Turma)
app.post('/matriculas', (req, res) => {
    const { aluno_id, turma_id } = req.body;

    if (!aluno_id || !turma_id) {
        return res.status(400).json({ error: "Selecione o aluno e a turma." });
    }

    // Verifica se já está matriculado nessa turma pra não duplicar
    const checkSql = "SELECT * FROM matriculas WHERE aluno_id = ? AND turma_id = ?";
    
    db.query(checkSql, [aluno_id, turma_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao verificar matrícula." });
        
        if (results.length > 0) {
            return res.status(409).json({ error: "Aluno já matriculado nesta turma!" });
        }

        // Se não existe, insere
        const insertSql = `
            INSERT INTO matriculas (aluno_id, turma_id, data_matricula, status) 
            VALUES (?, ?, CURDATE(), 'Ativo')
        `;

        db.query(insertSql, [aluno_id, turma_id], (err, result) => {
            if (err) return res.status(500).json({ error: "Erro ao realizar matrícula." });
            res.status(201).json({ message: "Matrícula realizada com sucesso!" });
        });
    });
});

// --- ROTAS DE CHAMADA / FREQUÊNCIA ---

// 1. BUSCAR ALUNOS DE UMA TURMA (Para a lista de chamada)
app.get('/turmas/:id/alunos', (req, res) => {
    const turmaId = req.params.id;
    const sql = `
        SELECT a.id, a.nome, a.cpf, m.id as matricula_id
        FROM matriculas m
        JOIN alunos a ON m.aluno_id = a.id
        WHERE m.turma_id = ? AND m.status = 'Ativo'
        ORDER BY a.nome ASC
    `;
    
    db.query(sql, [turmaId], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar alunos." });
        res.json(results);
    });
});

// 2. SALVAR CHAMADA (AULA + FREQUÊNCIAS)
// 2. SALVAR CHAMADA (AULA + FREQUÊNCIAS) - CORRIGIDO
app.post('/chamada', (req, res) => {
    const { turma_id, disciplina_id, professor_id, data_aula, conteudos, frequencias } = req.body;

    // 1. PEGAR UMA CONEXÃO DEDICADA DO POOL
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Erro ao pegar conexão:", err);
            return res.status(500).json({ error: "Erro interno de conexão." });
        }

        // 2. INICIAR TRANSAÇÃO NA CONEXÃO
        connection.beginTransaction(err => {
            if (err) {
                connection.release(); // Libera se der erro logo de cara
                return res.status(500).json({ error: "Erro ao iniciar transação." });
            }

            const sqlAula = "INSERT INTO aulas (turma_id, disciplina_id, professor_id, data_aula, conteudo_ministrado) VALUES (?, ?, ?, ?, ?)";
            
            // Define o ID do professor (ajuste conforme sua lógica de login)
            const profIdReal = professor_id || 1; 

            // NOTA: Use 'connection.query', não 'db.query'
            connection.query(sqlAula, [turma_id, disciplina_id, profIdReal, data_aula, conteudos], (err, resultAula) => {
                if (err) {
                    // Se der erro, desfaz tudo (Rollback)
                    return connection.rollback(() => {
                        connection.release(); // Libera a conexão
                        console.error("Erro ao salvar aula:", err);
                        res.status(500).json({ error: "Erro ao criar registro da aula." });
                    });
                }

                const aulaId = resultAula.insertId;
                const sqlFreq = "INSERT INTO frequencias (aula_id, matricula_id, status) VALUES ?";
                
                // Prepara o array de arrays para insert em lote
                const valores = frequencias.map(f => [aulaId, f.matricula_id, f.status]);

                connection.query(sqlFreq, [valores], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("Erro ao salvar frequências:", err);
                            res.status(500).json({ error: "Erro ao salvar lista de presença." });
                        });
                    }

                    // 3. COMMIT (CONFIRMAR TUDO)
                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: "Erro ao finalizar transação." });
                            });
                        }
                        
                        // SUCESSO FINAL
                        connection.release(); // Muito importante liberar aqui!
                        res.status(201).json({ message: "Chamada realizada com sucesso!" });
                    });
                });
            });
        });
    });
});

// --- ROTA DO DASHBOARD ---
app.get('/dashboard', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM alunos) as total_alunos,
            (SELECT COUNT(*) FROM professores) as total_professores,
            (SELECT COUNT(*) FROM turmas) as total_turmas,
            (SELECT COUNT(*) FROM aulas) as total_aulas
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao carregar dashboard" });
        res.json(results[0]); // Retorna o primeiro objeto com os totais
    });
});

// --- ROTAS DE RELATÓRIOS ---

// 1. DADOS DA TURMA (Gráfico Geral + Lista de Alunos com % de Presença)
app.get('/relatorios/turma/:id', (req, res) => {
    const turmaId = req.params.id;

    // Query 1: Totais para o Gráfico de Pizza da Turma
    const sqlStats = `
        SELECT status, COUNT(*) as total 
        FROM frequencias f
        JOIN aulas a ON f.aula_id = a.id
        WHERE a.turma_id = ?
        GROUP BY status
    `;

    // Query 2: Lista de Alunos com cálculo de % de presença
    // Essa query é "braba": conta o total de aulas e quantas presenças cada um teve
    const sqlAlunos = `
        SELECT 
            a.id, a.nome, a.cpf,
            COUNT(f.id) as total_aulas,
            SUM(CASE WHEN f.status = 'Presente' THEN 1 ELSE 0 END) as presencas
        FROM matriculas m
        JOIN alunos a ON m.aluno_id = a.id
        LEFT JOIN frequencias f ON m.id = f.matricula_id
        WHERE m.turma_id = ?
        GROUP BY a.id
        ORDER BY a.nome
    `;

    db.query(sqlStats, [turmaId], (err, resultStats) => {
        if (err) return res.status(500).json(err);
        
        db.query(sqlAlunos, [turmaId], (err, resultAlunos) => {
            if (err) return res.status(500).json(err);
            
            // Calcula a porcentagem no backend pra facilitar o front
            const alunosCalculados = resultAlunos.map(aluno => ({
                ...aluno,
                percentual: aluno.total_aulas > 0 
                    ? Math.round((aluno.presencas / aluno.total_aulas) * 100) 
                    : 0
            }));

            res.json({ stats: resultStats, alunos: alunosCalculados });
        });
    });
});

// --- ROTA DE DADOS PARA OS GRÁFICOS DO DASHBOARD ---
app.get('/dashboard/dados', (req, res) => {
    // 1. Query para o Gráfico de Barras (Desempenho por Turma)
    const sqlTurmas = `
        SELECT 
            t.codigo, 
            t.turno,
            COUNT(f.id) as total_registros,
            SUM(CASE WHEN f.status = 'Presente' THEN 1 ELSE 0 END) as presencas
        FROM turmas t
        LEFT JOIN aulas a ON t.id = a.turma_id
        LEFT JOIN frequencias f ON a.id = f.aula_id
        GROUP BY t.id
    `;

    // 2. Query para o Gráfico de Pizza (Status Global)
    const sqlGlobal = `
        SELECT status, COUNT(*) as total 
        FROM frequencias 
        GROUP BY status
    `;

    db.query(sqlTurmas, (err, resultTurmas) => {
        if (err) return res.status(500).json({ error: err });

        db.query(sqlGlobal, (err, resultGlobal) => {
            if (err) return res.status(500).json({ error: err });

            // Processar os dados das turmas para calcular porcentagem
            const turmasFormatadas = resultTurmas.map(t => ({
                name: t.codigo, // O que aparece no eixo X
                turno: t.turno,
                taxa: t.total_registros > 0 
                    ? Math.round((t.presencas / t.total_registros) * 100) 
                    : 0
            }));

            res.json({
                graficoTurmas: turmasFormatadas,
                graficoGlobal: resultGlobal
            });
        });
    });
});

// 2. DADOS DO ALUNO INDIVIDUAL (Gráfico dele + Histórico)
app.get('/relatorios/aluno/:id/turma/:turmaId', (req, res) => {
    const { id, turmaId } = req.params;

    // Query 1: Stats do Aluno (Pizza dele)
    const sqlStats = `
        SELECT f.status, COUNT(*) as total
        FROM frequencias f
        JOIN matriculas m ON f.matricula_id = m.id
        WHERE m.aluno_id = ? AND m.turma_id = ?
        GROUP BY f.status
    `;

    // Query 2: Histórico Detalhado
    const sqlHistory = `
        SELECT a.data_aula, d.nome as disciplina, f.status
        FROM frequencias f
        JOIN matriculas m ON f.matricula_id = m.id
        JOIN aulas a ON f.aula_id = a.id
        JOIN disciplinas d ON a.disciplina_id = d.id
        WHERE m.aluno_id = ? AND m.turma_id = ?
        ORDER BY a.data_aula DESC
    `;

    // Query 3: Info do Aluno
    const sqlInfo = "SELECT * FROM alunos WHERE id = ?";

    db.query(sqlStats, [id, turmaId], (err, stats) => {
        db.query(sqlHistory, [id, turmaId], (err, history) => {
            db.query(sqlInfo, [id], (err, info) => {
                res.json({ 
                    aluno: info[0], 
                    stats, 
                    history 
                });
            });
        });
    });
});


// ROTA: HISTÓRICO DE TODAS AS AULAS
app.get('/aulas', (req, res) => {
    const sql = `
        SELECT 
            a.id, 
            a.data_aula, 
            a.conteudo_ministrado,
            t.codigo as turma,
            t.turno,
            d.nome as disciplina,
            p.nome as professor
        FROM aulas a
        JOIN turmas t ON a.turma_id = t.id
        JOIN disciplinas d ON a.disciplina_id = d.id
        JOIN professores p ON a.professor_id = p.id
        ORDER BY a.data_aula DESC, a.id DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar histórico" });
        res.json(results);
    });
});
// Iniciar Servidor
app.listen(3001, () => {
    console.log("🚀 Servidor rodando na porta 3001");
});