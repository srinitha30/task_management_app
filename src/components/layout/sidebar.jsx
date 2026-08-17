import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  Palette,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
} from "lucide-react";

import "./sidebar.css";

function Sidebar({
  isOpen,
  closeSidebar,
  activePage,
  setActivePage,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "Tasks",
      icon: <CheckSquare size={19} />,
    },
    {
      name: "Calendar",
      icon: <CalendarDays size={19} />,
    },
    {
      name: "Team",
      icon: <Users size={19} />,
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={19} />,
    },
  ];

  const settingsItems = [
    {
      name: "Themes",
      icon: <Palette size={19} />,
    },
    {
      name: "Settings",
      icon: <Settings size={19} />,
    },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    closeSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow-auth");
    localStorage.removeItem("taskflow-user");

    window.location.reload();
  };


  const renderMenuItem = (item) => (
    <button
      key={item.name}
      type="button"
      className={`nav-item ${
        activePage === item.name ? "nav-active" : ""
      }`}
      onClick={() => handleNavigation(item.name)}
    >
      <span className="nav-icon">
        {item.icon}
      </span>

      <span className="nav-text">
        {item.name}
      </span>

      <ChevronRight
        size={15}
        className="nav-arrow"
      />
    </button>
  );

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* HEADER */}

        <div className="sidebar-header">

          <button
            className="brand"
            type="button"
            onClick={() =>
              handleNavigation("Dashboard")
            }
          >
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>

            <div className="brand-text">
              <strong>TaskFlow</strong>
              <span>Productivity</span>
            </div>
          </button>

          <button
            type="button"
            className="close-sidebar"
            onClick={closeSidebar}
          >
            <X size={21} />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <p className="menu-label">
            WORKSPACE
          </p>

          {menuItems.map(renderMenuItem)}


          <p className="menu-label settings-label">
            PERSONALIZE
          </p>

          {settingsItems.map(renderMenuItem)}

        </nav>


        {/* USER */}

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              S
            </div>

            <div className="sidebar-user-info">

              <strong>
                My Workspace
              </strong>

              <span>
                Personal account
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="nav-icon">
              <LogOut size={18} />
            </span>

            <span className="nav-text">
              Logout
            </span>

            <ChevronRight
              size={15}
              className="nav-arrow"
            />
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;