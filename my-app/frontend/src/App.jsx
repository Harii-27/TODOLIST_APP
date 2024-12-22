// src/App.js (Frontend - React)

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('There was an error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (taskTitle) {
      try {
        const response = await axios.post('http://localhost:3000/tasks', { title: taskTitle });
        setTasks([...tasks, response.data]);
        setTaskTitle('');
      } catch (error) {
        console.error('There was an error adding the task:', error);
      }
    }
  };

  // Toggle task completion
  const toggleCompletion = async (id, completed) => {
    try {
      await axios.put(`http://localhost:3000/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error('There was an error updating the task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('There was an error deleting the task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Todo List</h1>

      <div>
        <input
          type="text"
          placeholder="Add a task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task.id, task.completed)}
            />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
