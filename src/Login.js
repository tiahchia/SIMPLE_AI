import { useState } from 'react';

import { loginUser } from './api';
import './App.css';

function Login({ onLoginSuccess, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await loginUser(username.trim(), password);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Welcome Back</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-fields">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            disabled={isSubmitting}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />

          {error && <div className="message message-system">{error}</div>}
        </div>
        <div className="auth-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      <p className="auth-switch">
        Need an account?{' '}
        <button type="button" onClick={onShowRegister} disabled={isSubmitting}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
