import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/Home';
import CollectionPage from './components/CollectionPage';
import LoginForm from './components/Login';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    if (storedJwt) {
      setIsLoggedIn(true);
      setJwt(storedJwt);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setJwt(null);
    localStorage.removeItem('jwt');
  };

  return (
    <Router>
      <div>
        <header className="header">
          <h1>CBC Team Management</h1>
          <nav className="nav">
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  <i className="fas fa-home"></i> Home
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/collection" className="nav-link">
                      <i className="fas fa-money-bill-wave"></i> Collection
                    </Link>
                  </li>
                  <li>
                    <button className="nav-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/register" className="nav-link">
                      <i className="fas fa-user"></i> Register
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="nav-link">
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {isLoggedIn ? (
            <>
              <Route path="/register" element={<Navigate to="/" />} />
              <Route path="/collection" element={<CollectionPage />} />
            </>
          ) : (
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/login"
                element={<LoginForm setIsLoggedIn={setIsLoggedIn} setJwt={setJwt} />}
              />
              <Route path="/collection" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

const RegisterPage = () => {
  return (
    <div>
      <h2>Register Page</h2>
      <RegisterForm />
    </div>
  );
};

export default App;
