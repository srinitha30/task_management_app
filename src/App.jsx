import { useEffect, useState } from "react";

import Sidebar from "./components/layout/sidebar";
import Dashboard from "./pages/dashboard/dashboard";
import Calendar from "./pages/calendar/calendar";
import Tasks from "./components/tasks/tasks";
import Team from "./pages/team/team";
import Analytics from "./pages/analytics/analytics";
import Themes from "./pages/themes/themes";
import Settings from "./pages/settings/settings";

import Login from "./pages/login/login";
import Register from "./components/Register/Register";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(
      localStorage.getItem("taskflow-auth") === "true"
    );

  const [showRegister, setShowRegister] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [currentTheme, setCurrentTheme] =
    useState(
      localStorage.getItem("taskflow-theme") ||
        "midnight"
    );

  useEffect(() => {
    const handleThemeChange = (event) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener(
      "themeChange",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange
      );
    };
  }, []);

  // LOGIN
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowRegister(false);
    setActivePage("Dashboard");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("taskflow-auth");
    localStorage.removeItem("taskflow-token");
    localStorage.removeItem("taskflow-user");

    setIsAuthenticated(false);
    setShowRegister(false);
    setSidebarOpen(false);
  };

  // AUTH PAGES
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onGoToLogin={() =>
            setShowRegister(false)
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() =>
          setShowRegister(true)
        }
      />
    );
  }

  return (
    <div className={`app theme-${currentTheme}`}>

      {/* SIDEBAR */}

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() =>
          setSidebarOpen(false)
        }
        activePage={activePage}
        setActivePage={(page) => {
          if (page === "Logout") {
            handleLogout();
            return;
          }

          setActivePage(page);
          setSidebarOpen(false);
        }}
      />

      {/* MAIN */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            ☰
          </button>

          <h2 className="topbar-title">
            {activePage}
          </h2>

          <div className="topbar-user">
            <div className="user-avatar">
              S
            </div>
          </div>

        </header>

        {/* PAGE CONTENT */}

        <div className="page-content">

          {activePage === "Dashboard" && (
            <Dashboard />
          )}

          {activePage === "Tasks" && (
            <Tasks />
          )}

          {activePage === "Calendar" && (
            <Calendar />
          )}

          {activePage === "Team" && (
            <Team />
          )}

          {activePage === "Analytics" && (
            <Analytics />
          )}

          {activePage === "Themes" && (
            <Themes />
          )}

          {activePage === "Settings" && (
            <Settings />
          )}

        </div>

      </main>

    </div>
  );
}

export default App;