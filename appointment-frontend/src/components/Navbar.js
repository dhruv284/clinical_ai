import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'bg-light'}`}
      style={{ borderBottom: '1px solid #ccc' }}
    >
      <div className="container-fluid">
        {/* Logo and brand */}
        <Link className={`navbar-brand fw-bold d-flex align-items-center ${theme === 'dark' ? 'text-light' : 'text-primary'}`} to="/">
          <span style={{ fontSize: '1.5rem' }}>🩺</span>
          <span className="ms-2 fs-4">
            Clinic<span className="text-danger">AI</span>
          </span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">🏠 Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">🔐 Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">📝 Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/form">📄 Manual Booking</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/voice">🎙️ Voice Booking</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">📋 All Appointments</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            )}
            {/* 🌙 Theme toggle */}
            <li className="nav-item ms-3">
              <button
                className={`btn btn-sm btn-${theme === 'dark' ? 'light' : 'dark'}`}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
