const express = require("express");
const server = express();

server.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  // TODO: Criar um middleware para certificar que os dados eståo em string e com aspas duplas

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/**
 * Retorna todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  /**
   * OBS: Tecnicamente eu estou fazendo uma atribuição dentro da referencia,
   * verificar se isso é a forma correta
   */
  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id;
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
