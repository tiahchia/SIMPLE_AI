import { useState } from 'react';
import { loginUser } from './api';
import './App.css';

function Login({ onLoginSuccess, onShowRegister }) {
  const [identifier, setIdentifier] = useState(''); // email for Supabase
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser(identifier.trim(), password);

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Welcome Back</h1>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-fields">
         <label>Email</label>
<input
  type="email"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Enter your email"
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
