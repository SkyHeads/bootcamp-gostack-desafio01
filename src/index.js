const express = require("express");

const app = express();
app.use(express.json());

const projects = [];
let numberOfRequests = 0;

function logRequest(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições ${numberOfRequests}`);

  return next();
}

app.use(logRequest);

function checkId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  return next();
}

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

app.put("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});

app.post("/projects/:id/tasks", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects);
});

app.listen(3333);
