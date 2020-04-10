const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository ID.'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  // TODO
  return response.json( repositories );
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push( repository );
  return response.json( repository );
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositorieIndex = repositories.findIndex( repo => repo.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const likes = repositories[repositorieIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositorieIndex] = repository;

  return response.json( repository );

});

app.delete("/repositories/:id",validateId, (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex( repo => repo.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex( repo => repo.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
