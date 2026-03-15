import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title.trim()) return;

    try {
      if (editId) {
        await axios.put(`${API}/tasks/${editId}`, { title });
        setEditId(null);
      } else {
        await axios.post(`${API}/tasks`, { title });
      }

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addOrUpdateTask();
  };

  return (
    <div className="app-card">
      <div className="app-header">
        <h1>
          ✅ My Tasks
          {tasks.length > 0 && (
            <span className="task-count">{tasks.length}</span>
          )}
        </h1>
        <p>Stay organized, stay productive</p>
      </div>

      <div className="input-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
        />
        <button className="btn-primary" onClick={addOrUpdateTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📝</div>
          <p>No tasks yet — add one above!</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <span className="task-title">{task.title}</span>
              <div className="task-actions">
                <button className="btn-edit" onClick={() => editTask(task)}>
                  ✏️ Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteTask(task.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
