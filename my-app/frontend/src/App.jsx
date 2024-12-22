import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [filter, setFilter] = useState('all'); // Filter for all, completed, or incomplete tasks

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('There was an error fetching tasks:', error);
    }
  };

  // Add new task to the backend
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

  // Toggle completion status of a task
  // Toggle completion status of a task
const toggleCompletion = async (id, completed) => {
  try {
    // Optimistically update the UI
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !completed } : task
    );
    setTasks(updatedTasks); // Update state without waiting for backend response

    // Then update the backend
    await axios.put(`http://localhost:3000/tasks/${id}`, { completed: !completed });
  } catch (error) {
    console.error('There was an error updating the task:', error);
    // If the API fails, you may want to revert the UI update, or handle it differently.
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

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
  };

  // Edit task
  const editTask = async () => {
    if (taskTitle && editingTaskId) {
      try {
        console.log(`Editing task ID: ${editingTaskId}, Title: ${taskTitle}`);  // Debugging log
        await axios.put(`http://localhost:3000/tasks/${editingTaskId}`, { title: taskTitle, completed: false });
        fetchTasks();
        setTaskTitle('');
        setEditingTaskId(null); // Reset editing task
      } catch (error) {
        console.error('There was an error editing the task:', error);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true; // Return all tasks for 'all' filter
  });

  return (
    <div className="App">
      <h1>Todo List</h1>

      <div>
  <input
    type="text"
    placeholder="Add or Edit a task"
    value={taskTitle}
    onChange={(e) => setTaskTitle(e.target.value)}
  />
  {/* Conditionally render either Save Changes or Add Task button */}
  {editingTaskId ? (
    <button onClick={editTask}>Save Changes</button>  // Button to save the edited task
  ) : (
    <button onClick={addTask}>Add Task</button>  // Button to add a new task
  )}
</div>


      {/* Filter dropdown */}
      <div>
        <label htmlFor="taskFilter">Filter tasks: </label>
        <select id="taskFilter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Task list */}
      <ul>
  {filteredTasks.map((task) => (
    <li key={task.id}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleCompletion(task.id, task.completed)}
      />
      <span
        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      >
        {task.title}
      </span>
      <button onClick={() => startEditing(task)}>Edit</button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
