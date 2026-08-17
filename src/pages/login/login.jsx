import { useState } from "react";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";

import "./Login.css";

function Login({ onLogin, onGoToRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://task-management-app-as5p.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem(
        "taskflow-auth",
        "true"
      );

      localStorage.setItem(
        "taskflow-token",
        data.token
      );

      localStorage.setItem(
        "taskflow-user",
        JSON.stringify(data.user)
      );

      onLogin();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* BACKGROUND GLOW */}

      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      {/* CARD */}

      <div className="login-card">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            <LogIn size={21} />
          </div>

          <span>TASKFLOW</span>

        </div>

        {/* HEADING */}

        <div className="login-heading">

          <h1>Welcome back!</h1>

          <p>
            Sign in to continue to your
            workspace.
          </p>

        </div>

        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="login-field">

            <label>Email Address</label>

            <div className="login-input">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label>Password</label>

            <div className="login-input">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />

                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />

                Sign In
              </>
            )}

          </button>

        </form>

        {/* REGISTER */}

        <div className="register-link">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={onGoToRegister}
          >
            <UserPlus size={15} />
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;