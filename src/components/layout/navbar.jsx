import "./Navbar.css";
import {
  Menu,
  Bell,
  Search
} from "lucide-react";

function Navbar({ openSidebar }) {
  return (
    <header className="navbar">

      <button
        className="menu-button"
        onClick={openSidebar}
      >
        <Menu size={22} />
      </button>

      <div className="navbar-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search tasks..."
        />
      </div>

      <div className="navbar-actions">

        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            S
          </div>

          <div className="user-info">
            <strong>Srinitha</strong>
            <span>Student</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;