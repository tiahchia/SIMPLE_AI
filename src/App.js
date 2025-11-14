import { useEffect, useState } from 'react';

import './App.css';
import ChatWindow from './ChatWindow';
import Login from './Login';
import Register from './Register';

function App() {
  const [activeView, setActiveView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setActiveView('chat');
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          setCurrentUser(null);
        }
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setActiveView('chat');
    setCurrentUser(user || null);
  };

  const handleShowRegister = () => {
    setActiveView('register');
  };

  const handleShowLogin = () => {
    setActiveView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setIsAuthenticated(false);
    setActiveView('login');
    setCurrentUser(null);
  };

  const renderContent = () => {
    if (isAuthenticated && activeView === 'chat') {
      return <ChatWindow />;
    }

    if (activeView === 'register') {
      return <Register onRegistrationComplete={handleShowLogin} />;
    }

    return <Login onLoginSuccess={handleLoginSuccess} onShowRegister={handleShowRegister} />;
  };

  return (
    <div className="app-container">
      <div className="aurora-layer" aria-hidden="true">
        <span className="aurora aurora-one" />
        <span className="aurora aurora-two" />
        <span className="aurora aurora-three" />
      </div>
      <div className="particle-layer" aria-hidden="true">
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
        <span className="particle particle-xs" />
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
        <span className="particle particle-xs" />
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
        <span className="particle particle-xs" />
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
        <span className="particle particle-xs" />
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
        <span className="particle particle-xs" />
        <span className="particle particle-sm" />
        <span className="particle particle-md" />
      </div>
      <div className="app-shell">
        <header className="app-header">
          <h1>
            {isAuthenticated && (currentUser?.name || currentUser?.username)
              ? `Welcome back, ${currentUser.name || currentUser.username}!`
              : '𝚂𝚒𝚖𝚙𝚕𝚎 AI 🧠'}
          </h1>
          <nav>
            {!isAuthenticated ? (
              <>
                <button type="button" className="header-button" onClick={handleShowLogin}>
                  Login
                </button>
                <button type="button" className="header-button" onClick={handleShowRegister}>
                  Register
                </button>
              </>
            ) : (
              <button type="button" className="header-button" onClick={handleLogout}>
                Log Out
              </button>
            )}
          </nav>
        </header>

        {renderContent()}

        {!isAuthenticated && activeView === 'register' && (
          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" onClick={handleShowLogin}>
              Log in here
            </button>
          </p>
        )}

        <footer className="app-footer">
          <span>
            &copy; <a href="https://simpleandstatic.com" target="_blank" rel="noreferrer">  𝚂𝚒𝚖𝚙𝚕𝚎 & 𝚂𝚝𝚊𝚝𝚒𝚌 </a> </span>
          
          <nav className="social-links">
            <a className="social-button" href="#" aria-label="Youtube placeholder">
              <span aria-hidden="true">🐦</span>
            </a>
            <a className="social-button" href="#" aria-label="Facebook placeholder">
              <span aria-hidden="true">📸</span>
            </a>
            <a className="social-button" href="#" aria-label="Whatsapp placeholder">
              <span aria-hidden="true">🔗</span>
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
}

export default App;
