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

// Iniciar Servidor
app.listen(3001, () => {
    console.log("🚀 Servidor rodando na porta 3001");
});