const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '../public_html/sra2/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para salvar imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `${uuidv4()}${ext}`);
    },
});

const upload = multer({ storage });


app.use('/sra2/uploads', express.static(uploadDir)); // Servir arquivos estáticos


const db = mysql.createPool({

    host:"localhost",
    user:"root",
    password:"Karolinne10",
    database:"acsSra2"
});

require('dotenv').config();

const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

function calcularStatus(data_inicio, data_final) {
    const hoje = new Date();

    const inicio = new Date(data_inicio);
    const fim = new Date(data_final);

    if (hoje < inicio) {
        return "a_comecar";
    } else if (hoje >= inicio && hoje <= fim) {
        return "em_andamento";
    } else {
        return "finalizado";
    }
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token

    if (!token) {
        return res.status(401).send("Token não fornecido.");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Adiciona os dados do usuário no objeto req
        next();
    } catch (err) {
        return res.status(403).send("Token inválido ou expirado.");
    }
};


app.post("/inserirProjeto", upload.fields([{ name: 'logo_projeto', maxCount: 1 }]), (req, res) => {

    const { nome, descricao, data_inicio, data_final } = req.body;


    // Verifica se a foto de capa foi enviada
    if (!req.files['logo_projeto']) {
        return res.status(400).json({ error: 'Foto de capa é obrigatória' });
    }

    // Processa a foto de capa
    const logoProjetoFile = req.files['logo_projeto'][0];

    const fotoCapaUrl = `/sra2/uploads/${logoProjetoFile.filename}`;

    const status = calcularStatus(data_inicio, data_final);

    // console.log(`dados a seguir: nome=${nome}, descricao=${descricao}, status=${status}`);


    let SQL = `
  INSERT INTO projeto (nome, descricao, data_inicio, data_final, status, logo_projeto) 
  VALUES (?,?,?,?,?,?)
`;

    db.query(
        SQL,
        [nome, descricao, data_inicio, data_final, status, fotoCapaUrl],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erro ao inserir projeto no banco de dados");
            } else {
                res.send(result);
            }
        });
});


app.get("/listarProjetos", (req, res) => {
    
    let SQL = 'SELECT * FROM projeto';

    db.query(SQL, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erro ao consultar banco de dados");
        } else {
            res.send(result);
        }
    });
});

// lista todos os projetos que nao estajam finalizados
app.get("/listarProjetosAtivos", (req, res) => {
    
    let SQL = "SELECT * FROM projeto WHERE status != 'finalizado'";

    db.query(SQL, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erro ao consultar banco de dados");
        } else {
            res.send(result);
        }
    });
});

app.get("/getProjetoById", (req, res) =>{

    const { id } = req.query    

    let SQL= 'SELECT * FROM projeto WHERE id_projeto = ?';

    db.query(SQL, [id], (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send("Erro ao consultar banco de dados");
        } else {
            
            res.send(result);
            
        }
    });

});


app.put("/alterarLogoProjetoById", upload.single('imagem'), (req, res) => {
    const { url_deletar, id_projeto } = req.body;
    const novaImagem = req.file;

    // 1. Remove a imagem antiga (não espera)
    if (url_deletar) {
        deletarImagemSilenciosamente(url_deletar); // Executa e esquece
    }

    // 2. Atualiza o banco com a nova capa (sem delays)
    const novaUrlCapa = `/sra2/uploads/${novaImagem.filename}`;
    db.query(
        "UPDATE projeto SET logo_projeto = ? WHERE id_projeto = ?",
        [novaUrlCapa, id_projeto],
        (err, result) => {
            if (err) {
                console.error("Erro no banco:", err);
                return res.status(500).json({ error: "Erro ao atualizar capa" });
            }
            res.json({ success: true, novaUrlCapa });
        }
    );
});



app.put("/editarDadosProjetoById", (req, res) => {
  const { id_projeto, nome, descricao, data_inicio, data_final } = req.body;

  const status = calcularStatus(data_inicio, data_final);

  const SQL = `
    UPDATE projeto 
    SET nome = ?, descricao = ?, data_inicio = ?, data_final = ?, status = ?
    WHERE id_projeto = ?
  `;

  db.query(SQL, [nome, descricao, data_inicio, data_final, status, id_projeto], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao atualizar projeto");
    } else {
      res.send(result);
    }
  });
});

function deletarImagemSilenciosamente(nomeImagem) {
    const nomeArquivo = nomeImagem.replace(/^\/?sra2\/uploads\//, '');
    const caminhoAbsoluto = path.join(__dirname, '../public_html/sra2/uploads', nomeArquivo);

    fs.unlink(caminhoAbsoluto, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`[Silent] Falha ao deletar ${nomeArquivo}:`, err.message);
        }
    });
}

app.delete("/deleteProjetoById/:id", (req, res) => {
  const { id } = req.params;
  const { logo_projeto } = req.query;

  if (logo_projeto) {
    deletarImagemSilenciosamente(logo_projeto);
  }

  const SQL = "DELETE FROM projeto WHERE id_projeto = ?";
  db.query(SQL, [id], (err, result) => {
    if (err) {
      console.error("💥 Erro ao deletar projeto:", err);
      return res.status(500).json({ error: "Erro no banco de dados" });
    } else {
      return res.json({ success: true, message: "Projeto e imagem deletados!" });
    }
  });
});

// CRUD INSCRIÇÃO

function calcularStatusInscricao(data_inicio, data_final) {
  const hoje = new Date();
  const inicio = new Date(data_inicio);
  const fim = new Date(data_final);

  if (hoje < inicio) {
        return "a_comecar";
    } else if (hoje >= inicio && hoje <= fim) {
        return "em_andamento";
    } else {
        return "finalizado";
    }
}


// Inserir inscrição
app.post("/inserirInscricao", (req, res) => {
  const { descricao, data_inicio, data_final, id_projeto } = req.body;

  const status = calcularStatusInscricao(data_inicio, data_final);

  const SQL = `
    INSERT INTO inscricao (descricao, status, data_inicio, data_final, id_projeto)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(SQL, [descricao, status, data_inicio, data_final, id_projeto], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao inserir inscrição");
    } else {
      res.send(result);
    }
  });
});

// Atualizar inscrição
app.put("/editarInscricaoById", (req, res) => {
  const { id_inscricao, descricao, data_inicio, data_final, id_projeto } = req.body;

  const status = calcularStatusInscricao(data_inicio, data_final);

  const SQL = `
    UPDATE inscricao 
    SET descricao = ?, status = ?, data_inicio = ?, data_final = ?, id_projeto = ?
    WHERE id_inscricao = ?
  `;

  db.query(SQL, [descricao, status, data_inicio, data_final, id_projeto, id_inscricao], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao atualizar inscrição");
    } else {
      res.send(result);
    }
  });
});

// Listar todas inscrições com o nome do projeto que ela faz referencia em id_projeto
app.get("/listarInscricoes", (req, res) => {
  const SQL = `
    SELECT 
      i.*, 
      p.nome as nome_projeto 
    FROM inscricao i
    INNER JOIN projeto p ON i.id_projeto = p.id_projeto
  `;
  
  db.query(SQL, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao listar inscrições");
    } else {
      res.send(result);
    }
  });
});

// Buscar inscrição por id
app.get("/getInscricaoById", (req, res) => {
  const { id_inscricao } = req.query;
  

  const SQL = "SELECT * FROM inscricao WHERE id_inscricao = ?";
  db.query(SQL, [id_inscricao], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao buscar inscrição");
    } else {
      res.send(result);
    }
  });
});

// Deletar inscrição
app.delete("/deletarInscricaoById/:id_inscricao", (req, res) => {
  const { id_inscricao } = req.params;
  console.log(id_inscricao);

  const SQL = "DELETE FROM inscricao WHERE id_inscricao = ?";
  db.query(SQL, [id_inscricao], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao deletar inscrição");
    } else {
      res.send(result);
    }
  });
});

app.post("/inserirCandidatosEmLote", (req, res) => {
  const { id_inscricao, id_projeto, candidatos } = req.body;

  if (!candidatos || candidatos.length === 0) {
    return res.status(400).send("Nenhum candidato enviado.");
  }

  // VAI TER QUE MUDAR PELO ID DE PESSOA QUE RETORNA DE LA
  const valuesCandidatos = candidatos.map((c) => [
    c.id,
    id_projeto,
    id_inscricao,
    c.status || "pendente",
  ]);

  const valuesPessoaProjeto = candidatos.map((c) => [
    c.id,
    id_projeto,
    c.nome_completo,
    c.apelido,
    c.data_nasc,
  ]);


  // Queries de inserção
  const sqlCandidatos = `
    INSERT INTO candidato (id_pessoa, id_projeto, id_inscricao, status)
    VALUES ?
  `;

  const sqlPessoaProjeto = `
    INSERT INTO pessoa_projeto (id_pessoa, id_projeto, pessoa_nome, pessoa_apelido, pessoa_data_nasci)
    VALUES ?
  `;

  // Executa as duas inserções em sequência
  db.query(sqlCandidatos, [valuesCandidatos], (err, result1) => {
    if (err) {
      console.log("Erro ao inserir candidatos:", err);
      return res.status(500).send("Erro ao inserir candidatos");
    }

    db.query(sqlPessoaProjeto, [valuesPessoaProjeto], (err, result2) => {
      if (err) {
        console.log("Erro ao inserir pessoa_projeto:", err);
        return res.status(500).send("Erro ao inserir pessoa_projeto");
      }

      res.send({
        message: "Candidatos inseridos com sucesso",
        candidatosResult: result1,
        pessoaProjetoResult: result2,
      });
    });
  });
});

// GET /listarCandidatos
app.get("/listarCandidatos", (req, res) => {
  const sql = `
    SELECT 
      pp.id_pessoa,
      pp.pessoa_nome AS nome,
      pp.pessoa_apelido AS apelido,
      TIMESTAMPDIFF(YEAR, pp.pessoa_data_nasci, CURDATE()) AS idade,
      i.descricao AS inscricao_descricao,
      p.nome AS projeto_nome,
      c.status AS status_candidato   -- 👈 aqui
    FROM pessoa_projeto pp
    INNER JOIN projeto p ON p.id_projeto = pp.id_projeto
    INNER JOIN candidato c ON c.id_pessoa = pp.id_pessoa AND c.id_projeto = pp.id_projeto
    INNER JOIN inscricao i ON i.id_inscricao = c.id_inscricao
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar candidatos:", err);
      return res.status(500).send("Erro ao buscar candidatos");
    }
    res.json(results);
  });
});






app.get("/", (req, res) => {
    res.send("olá, Djair")
});

app.listen(3001, ()=>{
    console.log("rodando servidor");
});