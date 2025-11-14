import { useState } from 'react';

import { registerUser } from './api';
import './App.css';

function Register({ onRegistrationComplete, onShowLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim() || !password) {
      setError('Please provide a username, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(username.trim(), email.trim(), password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Join the Circle</h1>
      <form className="register-card" onSubmit={handleSubmit}>
        <span className="register-orb register-orb-one" aria-hidden="true" />
        <span className="register-orb register-orb-two" aria-hidden="true" />
        <div className="register-body">
          <p className="register-intro">
            Step into a space crafted just for you. Share a few details and we&apos;ll remember them warmly.
          </p>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Choose a username"
            disabled={isSubmitting}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            disabled={isSubmitting}
          />

          {error && <div className="register-alert register-alert-error">{error}</div>}
          {success && <div className="register-alert register-alert-success">{success}</div>}

          <div className="register-actions">
            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? 'Weaving your profile...' : 'Begin the journey'}
            </button>
          </div>
        </div>
      </form>
      <p className="auth-switch">
        Already registered?{' '}
        <button type="button" onClick={onShowLogin} disabled={isSubmitting}>
          Back to login
        </button>
      </p>
    </div>
  );
}

export default Register;
