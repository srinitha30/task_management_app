import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

import "./settings.css";

function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem(
      "taskflow-user"
    );

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSave = () => {
    localStorage.setItem(
      "taskflow-user",
      JSON.stringify(user)
    );

    setMessage("Profile saved successfully.");
  };

  if (loading) {
    return (
      <div className="settings-loading">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <span className="settings-label">
            ACCOUNT
          </span>

          <h1>Settings</h1>

          <p>
            Manage your TaskFlow account and
            preferences.
          </p>
        </div>

        <div className="settings-icon">
          <SettingsIcon size={23} />
        </div>

      </div>


      {/* PROFILE */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div>
            <span>PROFILE</span>

            <h2>Personal Information</h2>

            <p>
              Update your account information.
            </p>
          </div>

          <div className="profile-avatar">
            {user.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

        </div>


        <div className="settings-form">

          {/* NAME */}

          <label>
            Full Name

            <div className="settings-input">

              <User size={18} />

              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                placeholder="Your name"
              />

            </div>
          </label>


          {/* EMAIL */}

          <label>
            Email Address

            <div className="settings-input">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                value={user.email || ""}
                disabled
              />

            </div>
          </label>


          {/* SAVE */}

          <div className="settings-actions">

            <button
              type="button"
              onClick={handleSave}
            >
              <Save size={17} />
              Save Changes
            </button>

          </div>

          {message && (
            <div className="settings-success">
              {message}
            </div>
          )}

        </div>

      </section>


      {/* SECURITY */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div>
            <span>SECURITY</span>

            <h2>Account Security</h2>

            <p>
              Your account is protected with
              password authentication.
            </p>
          </div>

          <div className="security-icon">
            <Lock size={20} />
          </div>

        </div>


        <div className="security-row">

          <div>
            <strong>Password</strong>

            <p>
              Your password is securely encrypted.
            </p>
          </div>

          <span className="security-badge">
            Protected
          </span>

        </div>

      </section>

    </div>
  );
}

export default Settings;