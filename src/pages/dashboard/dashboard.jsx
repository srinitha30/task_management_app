import { useEffect, useState } from "react";

import {
  Plus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Sparkles,
  ListTodo,
  Activity,
  Target,
} from "lucide-react";

import "./Dashboard.css";

const API_URL = "http://localhost:5000/api/tasks";

const emptyForm = {
  title: "",
  project: "",
  priority: "Medium",
  startDate: "",
  dueDate: "",
};

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {

  // ================================
  // STATE
  // ================================

  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState(emptyForm);


  // ================================
  // TOKEN
  // ================================

  const getToken = () => {
    return localStorage.getItem(
      "taskflow-token"
    );
  };


  // ================================
  // GET TASKS
  // ================================

  const fetchTasks = async () => {
    try {

      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        API_URL,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch tasks"
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


  // ================================
  // LOAD TASKS
  // ================================

  useEffect(() => {

    fetchTasks();

  }, []);


  // ================================
  // FORM CHANGE
  // ================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };


  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {

    setForm({
      ...emptyForm,
    });

    setEditingTask(null);

    setShowModal(false);

  };


  // ================================
  // CREATE MODAL
  // ================================

  const openCreateModal = () => {

    setForm({
      ...emptyForm,
    });

    setEditingTask(null);

    setShowModal(true);

  };


  // ================================
  // EDIT MODAL
  // ================================

  const openEditModal = (task) => {

    setEditingTask(task);

    setForm({

      title:
        task.title || "",

      project:
        task.project || "",

      priority:
        task.priority || "Medium",

      startDate:
        task.startDate
          ? task.startDate.substring(0, 10)
          : "",

      dueDate:
        task.dueDate
          ? task.dueDate.substring(0, 10)
          : "",
    });

    setShowModal(true);

  };


  // ================================
  // CREATE / UPDATE
  // ================================

  const saveTask = async (e) => {

    e.preventDefault();

    if (!form.title.trim()) {

      setError(
        "Please enter a task name"
      );

      return;
    }

    if (
      !form.startDate ||
      !form.dueDate
    ) {

      setError(
        "Please select both dates"
      );

      return;
    }

    if (
      form.dueDate <
      form.startDate
    ) {

      setError(
        "Due date cannot be before start date"
      );

      return;
    }

    try {

      setSaving(true);
      setError("");

      const token = getToken();

      const taskData = {

        title:
          form.title.trim(),

        description:
          form.project || "",

        priority:
          form.priority,

        startDate:
          form.startDate,

        dueDate:
          form.dueDate,

        status:
          editingTask
            ? editingTask.status
            : "Pending",
      };


      // ==========================
      // EDIT
      // ==========================

      if (editingTask) {

        const response =
          await fetch(
            `${API_URL}/${editingTask._id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  taskData
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to update task"
          );

        }

      }


      // ==========================
      // CREATE
      // ==========================

      else {

        const response =
          await fetch(
            API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  taskData
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to create task"
          );

        }

      }


      // Refresh from MongoDB

      await fetchTasks();

      resetForm();

    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    } finally {

      setSaving(false);

    }
  };


  // ================================
  // DELETE
  // ================================

  const deleteTask = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const token =
        getToken();

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete task"
        );

      }

      await fetchTasks();

    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    }
  };


  // ================================
  // CHANGE STATUS
  // ================================

  const changeStatus = async (task) => {

    let newStatus;

    if (
      task.status === "Pending"
    ) {

      newStatus =
        "In Progress";

    } else if (
      task.status === "In Progress"
    ) {

      newStatus =
        "Completed";

    } else {

      newStatus =
        "Pending";

    }

    try {

      const token =
        getToken();

      const response =
        await fetch(
          `${API_URL}/${task._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({

                status:
                  newStatus,

                completionDate:
                  newStatus ===
                  "Completed"
                    ? new Date()
                    : null,

              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update status"
        );

      }

      await fetchTasks();

    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    }
  };


  // ================================
  // STATISTICS
  // ================================

  const completed =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;


  const inProgress =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length;


  const todo =
    tasks.filter(
      (task) =>
        task.status ===
        "Pending"
    ).length;


  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed /
            tasks.length) *
            100
        );


  // ================================
  // UI
  // ================================

  return (

    <div className="premium-dashboard">


      {/* ============================
          HERO
      ============================ */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <div className="hero-label">

            <Sparkles size={14} />

            PRODUCTIVITY WORKSPACE

          </div>

          <h1>
            Let's make today{" "}
            <span>
              productive.
            </span>
          </h1>

          <p>
            Plan your work, track your
            progress, and stay ahead
            of your deadlines.
          </p>

        </div>


        <button
          type="button"
          className="create-task"
          onClick={
            openCreateModal
          }
        >

          <Plus size={18} />

          Create Task

        </button>

      </section>


      {/* ============================
          ERROR
      ============================ */}

      {error && (

        <div className="login-error">

          {error}

        </div>

      )}


      {/* ============================
          STATS
      ============================ */}

      <section className="premium-stats">


        <div className="premium-stat stat-purple">

          <div className="stat-top">

            <span>
              Total Tasks
            </span>

            <div className="stat-icon">

              <ListTodo size={17} />

            </div>

          </div>

          <strong>
            {tasks.length}
          </strong>

          <small>
            All your tasks
          </small>

        </div>


        <div className="premium-stat stat-blue">

          <div className="stat-top">

            <span>
              In Progress
            </span>

            <div className="stat-icon">

              <Activity size={17} />

            </div>

          </div>

          <strong>
            {inProgress}
          </strong>

          <small>
            Currently working
          </small>

        </div>


        <div className="premium-stat stat-orange">

          <div className="stat-top">

            <span>
              To Do
            </span>

            <div className="stat-icon">

              <Circle size={17} />

            </div>

          </div>

          <strong>
            {todo}
          </strong>

          <small>
            Waiting to start
          </small>

        </div>


        <div className="premium-stat stat-green">

          <div className="stat-top">

            <span>
              Completed
            </span>

            <div className="stat-icon">

              <CheckCircle2
                size={17}
              />

            </div>

          </div>

          <strong>
            {completed}
          </strong>

          <small>
            {progress}%
            completion rate
          </small>

        </div>

      </section>


      {/* ============================
          PROGRESS
      ============================ */}

      <section className="progress-card">

        <div className="progress-info">

          <div className="progress-title">

            <div className="progress-icon">

              <Target size={18} />

            </div>

            <div>

              <strong>
                Weekly Progress
              </strong>

              <span>
                Keep pushing towards
                your goals
              </span>

            </div>

          </div>

          <strong className="progress-number">

            {progress}%

          </strong>

        </div>


        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

      </section>


      {/* ============================
          TASK PANEL
      ============================ */}

      <section className="glass-panel">

        <div className="panel-header">

          <div>

            <span className="panel-eyebrow">

              TASK MANAGEMENT

            </span>

            <h2>
              My Tasks
            </h2>

            <p>
              Track your work and
              deadlines.
            </p>

          </div>


          <button
            type="button"
            className="board-add"
            onClick={
              openCreateModal
            }
          >

            <Plus size={16} />

            Add Task

          </button>

        </div>


        {/* ==========================
            LOADING
        ========================== */}

        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">

              <ListTodo size={26} />

            </div>

            <h3>
              Loading tasks...
            </h3>

            <p>
              Getting your tasks
              from MongoDB.
            </p>

          </div>

        ) : tasks.length === 0 ? (

          /* ==========================
             EMPTY
          ========================== */

          <div className="empty-state">

            <div className="empty-icon">

              <ListTodo size={26} />

            </div>

            <h3>
              No tasks yet
            </h3>

            <p>
              Create your first task
              and start getting
              productive.
            </p>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="empty-create"
            >

              <Plus size={16} />

              Create your first task

            </button>

          </div>

        ) : (

          /* ==========================
             TASK LIST
          ========================== */

          <div className="task-list">

            {tasks.map(
              (task) => (

                <div
                  className="premium-task"
                  key={task._id}
                >


                  {/* STATUS */}

                  <button
                    type="button"
                    className={`task-check ${
                      task.status ===
                      "Completed"
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      changeStatus(
                        task
                      )
                    }
                    title="Change status"
                  >

                    {task.status ===
                    "Completed" ? (

                      <CheckCircle2
                        size={21}
                      />

                    ) : (

                      <Circle
                        size={21}
                      />

                    )}

                  </button>


                  {/* CONTENT */}

                  <div className="task-main">

                    <div className="task-title-row">

                      <h3
                        className={
                          task.status ===
                          "Completed"
                            ? "task-completed"
                            : ""
                        }
                      >

                        {task.title}

                      </h3>


                      <span
                        className={`priority-tag ${
                          (
                            task.priority ||
                            "Medium"
                          ).toLowerCase()
                        }`}
                      >

                        {task.priority ||
                          "Medium"}

                      </span>

                    </div>


                    <div className="task-meta">

                      <span className="project-name">

                        📁{" "}
                        {task.description ||
                          "General"}

                      </span>


                      {task.startDate && (

                        <span>

                          <CalendarDays
                            size={13}
                          />

                          {formatDate(
                            task.startDate
                          )}

                        </span>

                      )}


                      {task.dueDate && (

                        <span>

                          <Clock3
                            size={13}
                          />

                          {formatDate(
                            task.dueDate
                          )}

                        </span>

                      )}


                      <span
                        className={`status-pill ${
                          task.status
                            .toLowerCase()
                            .replace(
                              " ",
                              "-"
                            )
                        }`}
                      >

                        {task.status ===
                        "Pending"
                          ? "To Do"
                          : task.status}

                      </span>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="task-actions">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        openEditModal(
                          task
                        )
                      }
                    >

                      Edit

                    </button>


                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteTask(
                          task._id
                        )
                      }
                    >

                      Delete

                    </button>


                    <button
                      type="button"
                      className="more-button"
                      onClick={() =>
                        changeStatus(
                          task
                        )
                      }
                      title="Change status"
                    >

                      <MoreHorizontal
                        size={17}
                      />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ============================
          CREATE / EDIT MODAL
      ============================ */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={
            resetForm
          }
        >

          <div
            className="task-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <span className="panel-eyebrow">

                  {editingTask
                    ? "EDIT TASK"
                    : "NEW TASK"}

                </span>

                <h2>

                  {editingTask
                    ? "Edit Task"
                    : "Create Task"}

                </h2>

                <p>

                  {editingTask
                    ? "Update your task details."
                    : "Add a new task to your workspace."}

                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  resetForm
                }
              >

                ×

              </button>

            </div>


            {/* FORM */}

            <form
              className="task-form"
              onSubmit={
                saveTask
              }
            >


              <label>

                Task Name

                <input
                  type="text"
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="What needs to be done?"
                  autoFocus
                />

              </label>


              <label>

                Project

                <input
                  type="text"
                  name="project"
                  value={
                    form.project
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Website"
                />

              </label>


              <label>

                Priority

                <select
                  name="priority"
                  value={
                    form.priority
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Urgent">
                    Urgent
                  </option>

                </select>

              </label>


              <div className="form-row">

                <label>

                  Start Date

                  <input
                    type="date"
                    name="startDate"
                    value={
                      form.startDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </label>


                <label>

                  Due Date

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      form.dueDate
                    }
                    min={
                      form.startDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </label>

              </div>


              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    resetForm
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="submit-task"
                  disabled={
                    saving
                  }
                >

                  {saving ? (

                    "Saving..."

                  ) : editingTask ? (

                    <>
                      <CheckCircle2
                        size={17}
                      />

                      Save Changes
                    </>

                  ) : (

                    <>
                      <Plus
                        size={17}
                      />

                      Create Task
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;