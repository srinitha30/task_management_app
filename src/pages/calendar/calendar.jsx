import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

import "./Calendar.css";

const API_URL = "https://task-management-app-as5p.onrender.com/api/tasks";
function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("taskflow-token");

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const selectedTasks = tasks.filter((task) => {
    const startDate = task.startDate
      ? task.startDate.substring(0, 10)
      : "";

    const dueDate = task.dueDate
      ? task.dueDate.substring(0, 10)
      : "";

    return (
      startDate === selectedDate ||
      dueDate === selectedDate
    );
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="calendar-page">

      {/* HEADER */}

      <div className="calendar-header">

        <div>
          <span className="calendar-label">
            WORKSPACE
          </span>

          <h1>Calendar</h1>

          <p>
            View your tasks and deadlines.
          </p>
        </div>

        <div className="calendar-icon">
          <CalendarDays size={23} />
        </div>

      </div>


      {/* DATE SELECTOR */}

      <div className="calendar-date-card">

        <label>
          Select Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />

      </div>


      {/* ERROR */}

      {error && (
        <div className="calendar-error">
          {error}
        </div>
      )}


      {/* TASKS */}

      <div className="calendar-task-panel">

        <div className="calendar-panel-header">

          <div>
            <span>
              SELECTED DATE
            </span>

            <h2>
              {formatDate(selectedDate)}
            </h2>
          </div>

          <strong>
            {selectedTasks.length} Tasks
          </strong>

        </div>


        {loading ? (

          <div className="calendar-empty">
            Loading tasks...
          </div>

        ) : selectedTasks.length === 0 ? (

          <div className="calendar-empty">

            <div className="calendar-empty-icon">
              <CalendarDays size={28} />
            </div>

            <h3>
              No tasks for this date
            </h3>

            <p>
              You don't have any scheduled
              tasks on this day.
            </p>

          </div>

        ) : (

          <div className="calendar-task-list">

            {selectedTasks.map((task) => (

              <div
                className="calendar-task"
                key={task._id}
              >

                <div className="calendar-status">

                  {task.status ===
                  "Completed" ? (
                    <CheckCircle2 size={21} />
                  ) : task.status ===
                    "In Progress" ? (
                    <Clock3 size={21} />
                  ) : (
                    <Circle size={21} />
                  )}

                </div>


                <div className="calendar-task-content">

                  <h3>
                    {task.title}
                  </h3>

                  <p>
                    {task.description ||
                      "General Task"}
                  </p>

                  <div className="calendar-task-meta">

                    {task.startDate && (
                      <span>
                        Start:{" "}
                        {task.startDate.substring(
                          0,
                          10
                        )}
                      </span>
                    )}

                    {task.dueDate && (
                      <span>
                        Due:{" "}
                        {task.dueDate.substring(
                          0,
                          10
                        )}
                      </span>
                    )}

                  </div>

                </div>


                <div
                  className={`calendar-task-status ${
                    task.status
                      .toLowerCase()
                      .replace(
                        " ",
                        "-"
                      )
                  }`}
                >
                  {task.status === "Pending"
                    ? "To Do"
                    : task.status}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Calendar;