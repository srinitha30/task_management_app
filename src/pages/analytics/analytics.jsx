import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
  Target,
} from "lucide-react";

import "./analytics.css";

const API_URL = "https://task-management-app-as5p.onrender.com/api/tasks";
function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

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
          data.message || "Failed to fetch analytics"
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

  // =========================
  // ANALYSIS
  // =========================

  const totalTasks = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completed / totalTasks) * 100);

  const highPriority = tasks.filter(
    (task) =>
      task.priority === "High" ||
      task.priority === "Urgent"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading your analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <div>
          <span className="analytics-label">
            PERFORMANCE
          </span>

          <h1>Analytics</h1>

          <p>
            Understand your productivity using
            your real TaskFlow data.
          </p>
        </div>

        <div className="analytics-header-icon">
          <BarChart3 size={24} />
        </div>
      </div>


      {/* ERROR */}

      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}


      {/* MAIN STATS */}

      <div className="analytics-stats">

        {/* TOTAL */}

        <div className="analytics-card">

          <div className="analytics-card-top">
            <span>Total Tasks</span>

            <div className="analytics-icon">
              <ListTodo size={19} />
            </div>
          </div>

          <strong>{totalTasks}</strong>

          <small>
            Tasks created
          </small>

        </div>


        {/* COMPLETED */}

        <div className="analytics-card">

          <div className="analytics-card-top">
            <span>Completed</span>

            <div className="analytics-icon">
              <CheckCircle2 size={19} />
            </div>
          </div>

          <strong>{completed}</strong>

          <small>
            Finished tasks
          </small>

        </div>


        {/* IN PROGRESS */}

        <div className="analytics-card">

          <div className="analytics-card-top">
            <span>In Progress</span>

            <div className="analytics-icon">
              <Clock3 size={19} />
            </div>
          </div>

          <strong>{inProgress}</strong>

          <small>
            Currently working
          </small>

        </div>


        {/* COMPLETION */}

        <div className="analytics-card">

          <div className="analytics-card-top">
            <span>Completion Rate</span>

            <div className="analytics-icon">
              <TrendingUp size={19} />
            </div>
          </div>

          <strong>{completionRate}%</strong>

          <small>
            Overall productivity
          </small>

        </div>

      </div>


      {/* PROGRESS SECTION */}

      <div className="analytics-grid">

        <section className="analytics-panel">

          <div className="analytics-panel-header">

            <div className="analytics-panel-icon">
              <Target size={19} />
            </div>

            <div>
              <h2>Task Progress</h2>

              <p>
                Current distribution of your tasks.
              </p>
            </div>

          </div>


          {/* COMPLETED */}

          <div className="progress-row">

            <div className="progress-row-info">
              <span>Completed</span>
              <strong>{completed}</strong>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill"
                style={{
                  width:
                    totalTasks === 0
                      ? "0%"
                      : `${(completed / totalTasks) * 100}%`,
                }}
              />
            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="progress-row">

            <div className="progress-row-info">
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill"
                style={{
                  width:
                    totalTasks === 0
                      ? "0%"
                      : `${(inProgress / totalTasks) * 100}%`,
                }}
              />
            </div>

          </div>


          {/* PENDING */}

          <div className="progress-row">

            <div className="progress-row-info">
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill"
                style={{
                  width:
                    totalTasks === 0
                      ? "0%"
                      : `${(pending / totalTasks) * 100}%`,
                }}
              />
            </div>

          </div>

        </section>


        {/* PRIORITY */}

        <section className="analytics-panel">

          <div className="analytics-panel-header">

            <div className="analytics-panel-icon">
              <BarChart3 size={19} />
            </div>

            <div>
              <h2>Priority Analysis</h2>

              <p>
                Tasks grouped by priority.
              </p>
            </div>

          </div>


          <div className="priority-analysis">

            <div className="priority-analysis-row">

              <span>
                High / Urgent
              </span>

              <strong>
                {highPriority}
              </strong>

            </div>


            <div className="priority-analysis-row">

              <span>
                Medium
              </span>

              <strong>
                {mediumPriority}
              </strong>

            </div>


            <div className="priority-analysis-row">

              <span>
                Low
              </span>

              <strong>
                {lowPriority}
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* INSIGHT */}

      <section className="analytics-insight">

        <div className="analytics-insight-icon">
          <TrendingUp size={21} />
        </div>

        <div>

          <span>PRODUCTIVITY INSIGHT</span>

          <h2>
            {totalTasks === 0
              ? "Start creating tasks"
              : completionRate >= 70
              ? "Excellent productivity!"
              : completionRate >= 40
              ? "You're making good progress."
              : "Time to focus on your tasks."}
          </h2>

          <p>
            {totalTasks === 0
              ? "Create your first task to start generating productivity insights."
              : `You have completed ${completed} out of ${totalTasks} tasks, giving you a ${completionRate}% completion rate.`}
          </p>

        </div>

      </section>

    </div>
  );
}

export default Analytics;