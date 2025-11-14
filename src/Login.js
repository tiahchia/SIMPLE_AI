import { useState } from "react";
import { loginUser } from "./api";
import "./App.css";

function Login({ onLoginSuccess, onShowRegister }) {
  const [email, setEmail] = useState(""); // changed from username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await loginUser(email.trim(), password);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Welcome Back</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-fields">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitting}
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          {error && <div className="message message-system">{error}</div>}
        </div>

        <div className="auth-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      <p className="auth-switch">
        Need an account?{" "}
        <button type="button" onClick={onShowRegister} disabled={isSubmitting}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
