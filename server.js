const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static("public"));

const port = 3000;

// Lista em memória
let disciplinas = [
 { id: 1, nome: "TECNOLOGIAS DE INTERNET", semestre: 4 },
 { id: 2, nome: "INTRODUÇÃO AS CIÊNCIAS SOCIAIS E POLÍTICAS", semestre: 3 },
 { id: 3, nome: "GERENCIA DE PROJETOS", semestre: 4 },
 { id: 4, nome: "SISTEMAS DE APOIO A DECISÃO", semestre: 4 }
];
let proximoId = 5; 

let perfil = {
  nome: 'Gustavo Italo de Oliveira',
  curso: 'Ciência da Computação',
  endereco: null
};

// Rota inicial
app.get("/", (req, res) => {
  res.send("API a rodar!");
});


      ///////////////////////////////
      //////  ROTAS DISCIPLINA  /////
      ///////////////////////////////

// GET - Listar disciplinas
app.get("/api/disciplinas", (req, res) => {
  res.json(disciplinas);
});

// POST - Criar disciplina
app.post("/api/disciplinas", (req, res) => {
  let { nome, semestre } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).send('O nome e o semestre não podem estar vazios.');
  }

  let novaDisciplina = { 
    id: proximoId, 
    nome: nome, 
    semestre: semestre 
  };
  
  proximoId = proximoId + 1; 
  disciplinas.push(novaDisciplina); 
  
  res.status(201).json(novaDisciplina);
});

// PUT - Editar disciplina
app.put("/api/disciplinas/:id", (req, res) => {
  let idNaUrl = Number(req.params.id);
  let { nome, semestre } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).send('O nome e o semestre não podem estar vazios.');
  }
  
  let disciplinaEncontrada = null;
  for (let i = 0; i < disciplinas.length; i++) {
    if (disciplinas[i].id === idNaUrl) {
      disciplinaEncontrada = disciplinas[i];
      break;
    }
  }
  
  if (disciplinaEncontrada == null) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  
  // Atualiza os dados
  disciplinaEncontrada.nome = nome;
  disciplinaEncontrada.semestre = semestre;
  
  res.json(disciplinaEncontrada);
});


      ///////////////////////////////
      //////     ROTAS CEP      /////
      ///////////////////////////////



app.get("/api/perfil", (req, res) => {
  res.json(perfil);
});

app.put("/api/perfil", (req, res) => {
  let { nome, curso, endereco } = req.body;

  if (!nome || !curso)
  {
    return res.status(400).send('Não foi possível indentificar o nome ou o curso');
  }

  perfil.nome = nome;
  perfil.curso = curso;
  perfil.endereco = endereco;

  res.json(perfil);
});



app.listen(port, () => {
  console.log(`Servidor a rodar na porta ${port}`);
});