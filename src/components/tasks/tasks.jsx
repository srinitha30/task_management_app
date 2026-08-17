import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  CalendarDays,
  Trash2,
  Pencil,
} from "lucide-react";

import "./Tasks.css";

const API_URL = "https://task-management-app-as5p.onrender.com/api/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    priority: "Medium",
    dueDate: "",
  });


  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("taskflow-token");
  };


  /* =====================================================
     GET TASKS
  ===================================================== */

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch tasks"
        );
      }

      setTasks(data.tasks || []);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     LOAD TASKS
  ===================================================== */

  useEffect(() => {
    fetchTasks();
  }, []);


  /* =====================================================
     OPEN CREATE
  ===================================================== */

  const openCreateForm = () => {
    setEditingTask(null);

    setForm({
      title: "",
      priority: "Medium",
      dueDate: "",
    });

    setShowForm(true);
  };


  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEditForm = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
    });

    setShowForm(true);
  };


  /* =====================================================
     CLOSE
  ===================================================== */

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);

    setForm({
      title: "",
      priority: "Medium",
      dueDate: "",
    });
  };


  /* =====================================================
     CREATE / UPDATE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a task name");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      const taskData = {
        title: form.title,
        priority: form.priority,
        dueDate: form.dueDate || null,

        status: editingTask
          ? editingTask.status
          : "Pending",
      };

      const url = editingTask
        ? `${API_URL}/${editingTask._id}`
        : API_URL;

      const method = editingTask
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save task"
        );
      }

      closeForm();

      await fetchTasks();

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     COMPLETE / STATUS
  ===================================================== */

  const toggleTask = async (task) => {
    let newStatus = "Pending";

    if (task.status === "Pending") {
      newStatus = "In Progress";
    } else if (task.status === "In Progress") {
      newStatus = "Completed";
    } else {
      newStatus = "Pending";
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${task._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,

            completionDate:
              newStatus === "Completed"
                ? new Date()
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task"
        );
      }

      await fetchTasks();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


  /* =====================================================
     DELETE
  ===================================================== */

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      await fetchTasks();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <div className="tasks-page">

      {/* HEADER */}

      <div className="tasks-header">

        <div>

          <span className="tasks-label">
            WORKSPACE
          </span>

          <h1>
            My Tasks
          </h1>

          <p>
            Create, organize and track your work.
          </p>

        </div>

        <button
          className="new-task-btn"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          New Task
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      {/* SEARCH */}

      <div className="task-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="task-count">
          {filteredTasks.length} Tasks
        </div>

      </div>


      {/* TASK LIST */}

      <div className="tasks-container">

        {loading ? (

          <div className="no-tasks">

            <h2>
              Loading tasks...
            </h2>

            <p>
              Getting your tasks from MongoDB.
            </p>

          </div>

        ) : filteredTasks.length === 0 ? (

          <div className="no-tasks">

            <CheckCircle2 size={40} />

            <h2>
              No tasks found
            </h2>

            <p>
              Create a new task to get started.
            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              className="task-card"
              key={task._id}
            >

              {/* STATUS */}

              <button
                className="task-status-btn"
                onClick={() =>
                  toggleTask(task)
                }
                title="Change status"
              >

                {task.status === "Completed" ? (
                  <CheckCircle2 size={23} />
                ) : (
                  <Circle size={23} />
                )}

              </button>


              {/* CONTENT */}

              <div className="task-card-content">

                <h3
                  className={
                    task.status === "Completed"
                      ? "completed-task"
                      : ""
                  }
                >
                  {task.title}
                </h3>

                <div className="task-details">

                  <span
                    className={`priority ${
                      (
                        task.priority ||
                        "Medium"
                      ).toLowerCase()
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>

                  {task.dueDate && (
                    <span>
                      <CalendarDays size={14} />
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  )}

                  <span className="task-status">
                    {task.status === "Pending"
                      ? "To Do"
                      : task.status}
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="task-actions">

                <button
                  title="Edit"
                  onClick={() =>
                    openEditForm(task)
                  }
                >
                  <Pencil size={16} />
                </button>

                <button
                  title="Delete"
                  onClick={() =>
                    deleteTask(task._id)
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>


      {/* MODAL */}

      {showForm && (

        <div
          className="task-modal-overlay"
          onClick={closeForm}
        >

          <div
            className="task-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-title">

              <div>

                <span>
                  {editingTask
                    ? "EDIT TASK"
                    : "NEW TASK"}
                </span>

                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Create Task"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <label>

                Task Name

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  autoFocus
                />

              </label>


              <label>

                Priority

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                >

                  <option>
                    Low
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    High
                  </option>

                </select>

              </label>


              <label>

                Due Date

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate: e.target.value,
                    })
                  }
                />

              </label>


              <div className="modal-buttons">

                <button
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Update Task"
                    : "Create Task"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Tasks;