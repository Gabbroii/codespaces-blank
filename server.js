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
let proximoId = 3;

// Rota inicial
app.get("/", (req, res) => {
  res.send("API a rodar!");
});

// GET - Listar disciplinas
app.get("/api/disciplinas", (req, res) => {
  res.json(disciplinas);
});

// POST - Criar disciplina
app.post("/api/disciplinas", (req, res) => {
  let nomeRecebido = req.body.nome;
  let semestreRecebido = req.body.semestre;

  if (nomeRecebido == undefined) {
    return res.status(400).json({ erro: "O campo nome é obrigatório" });
  }

  let novaDisciplina = { 
    id: proximoId, 
    nome: nomeRecebido, 
    semestre: semestreRecebido 
  };
  
  proximoId = proximoId + 1; // Prepara o próximo ID
  disciplinas.push(novaDisciplina); // Adiciona na lista
  
  res.status(201).json(novaDisciplina);
});

// PUT - Editar disciplina
app.put("/api/disciplinas/:id", (req, res) => {
  let idNaUrl = Number(req.params.id);
  
  // Procura a disciplina na lista
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
  
  let nomeRecebido = req.body.nome;
  
  if (nomeRecebido == undefined) {
    return res.status(400).json({ erro: "O campo nome é obrigatório" });
  }
  
  // Atualiza os dados
  disciplinaEncontrada.nome = nomeRecebido;
  disciplinaEncontrada.semestre = req.body.semestre;
  
  res.json(disciplinaEncontrada);
});

app.listen(port, () => {
  console.log(`Servidor a rodar na porta ${port}`);
});