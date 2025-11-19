-- 0. CRIAÇÃO DO BANCO DE DADOS
CREATE DATABASE sysEnfermagem;
USE sysEnfermagem;


-- Tabela de Cursos (Aqui entra Enfermagem, depois Informática, etc.)
CREATE TABLE cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL, -- Ex: Técnico em Enfermagem
    sigla VARCHAR(10) NOT NULL, -- Ex: TEC-ENF
    carga_horaria_total INT,    -- Importante para cursos técnicos
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Disciplinas (Módulos)
CREATE TABLE disciplinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL, -- Ex: Anatomia Humana
    carga_horaria INT NOT NULL, -- Ex: 60 horas
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Tabela de Professores
CREATE TABLE professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE,
    cpf VARCHAR(14) UNIQUE
) ENGINE = InnoDB;

-- Tabela de Turmas (Vincula um curso a um período)
CREATE TABLE turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT NOT NULL,
    codigo VARCHAR(20),    -- Ex: ENF2025-1-N (Enfermagem 2025.1 Noturno)
    periodo VARCHAR(20),   -- Ex: 1º Semestre, Módulo II
    turno ENUM('Manhã', 'Tarde', 'Noite', 'Integral'),
    data_inicio DATE,
    data_fim DATE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Tabela de Alunos
CREATE TABLE alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Matrículas (Muitos alunos em muitas turmas)
-- Necessária pois um aluno pode reprovar e fazer outra turma depois
CREATE TABLE matriculas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE,
    status ENUM('Ativo', 'Trancado', 'Concluido', 'Desistente'),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

-- Tabela de Aulas (O evento que ocorreu naquele dia)
CREATE TABLE aulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    turma_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    professor_id INT NOT NULL,
    data_aula DATE NOT NULL,
    conteudo_ministrado TEXT, -- Opcional, mas útil para diário de classe
    numero_aulas INT DEFAULT 1, -- Se for aula dupla, conta como 2 presenças
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    FOREIGN KEY (professor_id) REFERENCES professores(id)
);

-- Tabela de Chamada/Frequência (O registro individual)
CREATE TABLE frequencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aula_id INT NOT NULL,
    matricula_id INT NOT NULL, -- Vincula à matrícula, não só ao aluno
    status ENUM('Presente', 'Ausente', 'Justificado'),
    observacao VARCHAR(255), -- Ex: "Atestado médico entregue"
    FOREIGN KEY (aula_id) REFERENCES aulas(id),
    FOREIGN KEY (matricula_id) REFERENCES matriculas(id)
);







