import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Durán',
  password: '12345',
  database: 'todolist'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

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

app.get('/getTasks', checkAuthorization, (req, res) => {
  connection.query('SELECT * FROM tareas', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las tareas' });
    }
    return res.status(200).json(results);
  });
});

app.get('/getGoals', checkAuthorization, (req, res) => {
  connection.query('SELECT * FROM goals', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las metas' });
    }
    return res.status(200).json(results);
  });
});

app.post('/addTask', checkAuthorization, (req, res) => {
  const { name, description, deadline } = req.body;
  if (!name || !description || !deadline) {
    return res.status(400).json({ message: 'Faltan parámetros' });
  }
  const query = 'INSERT INTO tareas (name, description, deadline) VALUES (?, ?, ?)';
  connection.query(query, [name, description, deadline], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar la tarea' });
    }
    return res.status(200).json({ message: 'Tarea agregada exitosamente', id: results.insertId });
  });
});

app.post('/addGoal', checkAuthorization, (req, res) => {
  const { name, description, deadline } = req.body;
  if (!name || !description || !deadline) {
    return res.status(400).json({ message: 'Faltan parámetros' });
  }
  const query = 'INSERT INTO goals (name, description, deadline) VALUES (?, ?, ?)';
  connection.query(query, [name, description, deadline], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar la meta' });
    }
    return res.status(200).json({ message: 'Meta agregada exitosamente', id: results.insertId });
  });
});

app.delete('/removeTask', checkAuthorization, (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ message: 'Falta el parámetro taskId' });
  }
  const query = 'DELETE FROM tareas WHERE id = ?';
  connection.query(query, [taskId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
    return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  });
});

app.delete('/removeGoal', checkAuthorization, (req, res) => {
  const { goalId } = req.body;
  if (!goalId) {
    return res.status(400).json({ message: 'Falta el parámetro goalId' });
  }
  const query = 'DELETE FROM goals WHERE id = ?';
  connection.query(query, [goalId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar la meta' });
    }
    return res.status(200).json({ message: 'Meta eliminada exitosamente' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
