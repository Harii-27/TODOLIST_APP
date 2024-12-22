const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hari@389962',  // Replace with your MySQL password
  database: 'todo_app'  // Database name
});

db.connect((err) => {
  if (err) {
    console.error('Could not connect to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes

// Route for root (optional, to handle GET /)
app.get('/', (req, res) => {
    res.send('Welcome to the Todo App API');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to get tasks' });
    }
    res.json(results);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to add task' });
    }
    res.status(201).json({ id: result.insertId, title, completed: false });
  });
});

// Update a task (mark as completed)
// Update task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;  // Extract ID from the URL
    const { title, completed } = req.body;  // Get the updated title and completion status from the request body
    
    console.log(`Updating task with ID: ${id}, Title: ${title}, Completed: ${completed}`);  // Debugging log
    
    db.query('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err, result) => {
      if (err) {
        console.error('Failed to update task:', err);
        return res.status(500).json({ message: 'Failed to update task' });
      }
      
      // Send the updated task as the response
      res.json({ id, title, completed });
    });
  });
  

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
