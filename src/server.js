// server.js

import express from 'express';
const app = express();
const PORT = 3000;

const generateApiKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let apiKey = '';
  for (let i = 0; i < length; i++) {
    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return apiKey;
};

let apiKey = generateApiKey();
console.log('API Key generada:', apiKey);

const checkAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${apiKey}`) {
    return res.status(401).json({ message: 'API key incorrecta' });
  }
  next();
};

app.use(express.json());

let tasks = [];
let goals = [];

app.get('/getTasks', checkAuthorization, (req, res) => {
  return res.status(200).json(tasks);
});

app.delete('/removeTask', checkAuthorization, (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ message: 'Falta el parámetro taskId' });
  }
  tasks = tasks.filter(task => task.id !== taskId);
  return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
});

app.post('/addTask', checkAuthorization, (req, res) => {
  const { name, description, deadline } = req.body;
  const newTask = { id: tasks.length + 1, name, description, deadline };
  tasks.push(newTask);
  return res.status(200).json({ message: 'Tarea agregada exitosamente' });
});

app.get('/getGoals', checkAuthorization, (req, res) => {
  return res.status(200).json(goals);
});

app.delete('/removeGoal', checkAuthorization, (req, res) => {
  const { goalId } = req.body;
  if (!goalId) {
    return res.status(400).json({ message: 'Falta el parámetro goalId' });
  }
  goals = goals.filter(goal => goal.id !== goalId);
  return res.status(200).json({ message: 'Meta eliminada exitosamente' });
});

app.post('/addGoal', checkAuthorization, (req, res) => {
  const { name, description, deadline } = req.body;
  const newGoal = { id: goals.length + 1, name, description, deadline };
  goals.push(newGoal);
  return res.status(200).json({ message: 'Meta agregada exitosamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
