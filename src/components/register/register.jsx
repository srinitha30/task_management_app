import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";

import "./Register.css";

function Register({ onGoToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // PASSWORD STRENGTH
  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) {
      return {
        text: "",
        width: "0%",
        level: "",
      };
    }

    if (password.length < 6) {
      return {
        text: "Weak",
        width: "30%",
        level: "weak",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return {
        text: "Strong",
        width: "100%",
        level: "strong",
      };
    }

    return {
      text: "Medium",
      width: "65%",
      level: "medium",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // REQUIRED FIELDS
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    // PASSWORD LENGTH
    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    // PASSWORD MATCH
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // TERMS
    if (!agreeTerms) {
      setError(
        "Please agree to the Terms & Conditions"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess(
        "Account created successfully! 🎉"
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      // Go to login
      setTimeout(() => {
        onGoToLogin();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* BACKGROUND GLOW */}

      <div className="register-glow register-glow-one" />
      <div className="register-glow register-glow-two" />

      {/* CARD */}

      <div className="register-card">

        {/* BRAND */}

        <div className="register-brand">

          <div className="register-logo">
            <UserPlus size={21} />
          </div>

          <span>TASKFLOW</span>

        </div>

        {/* HEADING */}

        <div className="register-heading">

          <h1>Create your account</h1>

          <p>
            Start organizing your work and
            tasks today.
          </p>

        </div>

        {/* FORM */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="register-field">

            <label>Full Name</label>

            <div className="register-input">

              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="register-field">

            <label>Email Address</label>

            <div className="register-input">

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

          <div className="register-field">

            <label>Password</label>

            <div className="register-input">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
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

            {/* PASSWORD STRENGTH */}

            {form.password && (
              <div className="password-strength">

                <div className="strength-track">
                  <div
                    className={`strength-bar ${passwordStrength.level}`}
                    style={{
                      width:
                        passwordStrength.width,
                    }}
                  />
                </div>

                <span
                  className={`strength-text ${passwordStrength.level}`}
                >
                  {passwordStrength.text}
                </span>

              </div>
            )}

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-field">

            <label>Confirm Password</label>

            <div className="register-input">

              <Lock size={18} />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* PASSWORD MATCH */}

            {form.confirmPassword && (
              <div
                className={
                  form.password ===
                  form.confirmPassword
                    ? "password-match"
                    : "password-no-match"
                }
              >
                {form.password ===
                form.confirmPassword ? (
                  <>
                    <Check size={14} />
                    Passwords match
                  </>
                ) : (
                  "Passwords do not match"
                )}
              </div>
            )}

          </div>

          {/* TERMS */}

          <label className="terms">

            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) =>
                setAgreeTerms(
                  e.target.checked
                )
              }
            />

            <span className="custom-check">
              {agreeTerms && (
                <Check size={13} />
              )}
            </span>

            <span>
              I agree to the{" "}
              <button
                type="button"
                className="terms-link"
              >
                Terms & Conditions
              </button>
            </span>

          </label>

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-success">
              {success}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />

                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />

                Create Account
              </>
            )}

          </button>

        </form>

        {/* LOGIN */}

        <div className="back-login">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onGoToLogin}
          >
            <ArrowLeft size={15} />
            Sign in
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;