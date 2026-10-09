const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static("public"));
const port = 3000;

app.get("/", (req, res) => {
  res.send("API de Disciplinas rodando com sucesso! Acesse /api/disciplinas ou /api/perfil");
});

let disciplinas = [
 { id: 1, nome: "Tecnologias de Internet", semestre: 4 },
 { id: 2, nome: "Banco de Dados", semestre: 3 }
];
let proximoId = 3;

app.get("/api/disciplinas", (req, res) => {
 res.json(disciplinas);
});

const perfil = { nome: "Gustavo Italo", curso: "Ciência da Computação", semestre: 4 };

app.get("/api/perfil", (req, res) => {
 res.json(perfil);
});

app.get("/api/disciplinas/:id", (req, res) => {
  const id = Number(req.params.id);
  const disciplina = disciplinas.find((d) => d.id === id);
  if (!disciplina) {
    return res.status(404).json({ erro: "Disciplina não encontrada" });
  }
  res.json(disciplina);
});

app.post("/api/disciplinas", (req, res) => {
  const { nome, semestre } = req.body || {};
  if (!nome) {
    return res.status(400).json({ erro: "O campo nome é obrigatório" });
  }
  const nova = { id: proximoId++, nome, semestre };
  disciplinas.push(nova);
  res.status(201).json(nova);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});