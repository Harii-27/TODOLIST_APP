import { useState, useEffect } from "react";
import axios from "axios";

import { FaSun, FaMoon, FaPencilAlt, FaTrashAlt, FaSearch } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Save task (add or edit)
  const handleTaskSave = async () => {
    if (!newTask) return;

    try {
      if (editingTaskId) {

        await axios.put(`http://localhost:3000/tasks/${editingTaskId}`, {
          title: newTask,
        });
      } else {

        const response = await axios.post("http://localhost:3000/tasks", {
          title: newTask,
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }


      setNewTask("");
      setEditingTaskId(null);
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving the task:", error);
    }
  };


  const toggleCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    try {
      const updatedTask = { ...task, completed: !task.completed };
      // Update task completion status in the backend
      await axios.put(`http://localhost:3000/tasks/${id}`, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting the task:", error);
    }
  };

  // Filtered tasks based on search and filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "completed") return task.completed && matchesSearch;
    if (filter === "incomplete") return !task.completed && matchesSearch;
    return matchesSearch;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Toggle light/dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);


  return (
    <div className={`to-do-list ${isDarkMode ? "dark" : "light"}`}>
      <h1>TODO LIST</h1>


      <button className="theme-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>


      <div className="header-controls">
        <input
          type="text"
          className="search-box"
          placeholder="Search note..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FaSearch className="search-icon" />
        <div className="filter-container">
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">ALL</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      {searchQuery && filteredTasks.length === 0 && (
        <div className="empty-message">
          <img src="/src/assets/search.png" alt="No Results" className="no-results-image" />
          <p>Empty...</p>
        </div>
      )}

      <ol>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task.id)}
            />
            <span
              className="text"
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "black",
              }}
            >
              {task.title}
            </span>


            {!task.completed && (
              <>
                <button
                  className="edit-button"
                  onClick={() => {
                    setNewTask(task.title);
                    setEditingTaskId(task.id);
                    setIsModalOpen(true);
                  }}
                >
                  <FaPencilAlt />
                </button>

                <button className="delete-button" onClick={() => deleteTask(task.id)}>
                  <FaTrashAlt />
                </button>
              </>
            )}
          </li>
        ))}
      </ol>


      <button
        className="add-button"
        onClick={() => {
          setNewTask("");
          setEditingTaskId(null);
          setIsModalOpen(true);
        }}
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-header">{editingTaskId ? "Edit Task" : "NEW NOTE"}</h2>
            <input
              type="text"
              placeholder="Input your note..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
                CANCEL
              </button>
              <button className="apply-button" onClick={handleTaskSave}>
                {editingTaskId ? "UPDATE" : "APPLY"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
