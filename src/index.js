const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body

  const checksExistsRepository = repositories.find( repository => repository.id === id );

  if (!checksExistsRepository) return res.status(404).json({ error: "Repository Not Found" });
  
  const repositoryIndex = repositories.indexOf(checksExistsRepository);

  if (repositoryIndex === -1) return res.status(404).json({ error: "Repository not found" });

  const repository = repositories[repositoryIndex];

  if (title) { repository.title = title; }
  if (url) { repository.url = url; }
  if (techs) { repository.techs = techs; }

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const checksExistsRepository = repositories.find( repository => repository.id === id );

  if (!checksExistsRepository) return res.status(404).json({ error: "Repository Not Found" });
  
  const repositoryIndex = repositories.indexOf(checksExistsRepository);

  if (repositoryIndex === -1) return res.status(404).json({ error: "Repository not found" });

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const checksExistsRepository = repositories.find( repository => repository.id === id );

  if (!checksExistsRepository) return res.status(404).json({ error: "Repository Not Found" });
  
  const repositoryIndex = repositories.indexOf(checksExistsRepository);

  if (repositoryIndex === -1) return res.status(404).json({ error: "Repository not found" });

  ++repositories[repositoryIndex].likes;

  const repo = repositories[repositoryIndex];

  return res.json(repo);
});

module.exports = app;
