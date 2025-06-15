import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">ClinicAI</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navContent">
        <ul className="navbar-nav ms-auto">
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
            <Link className="nav-link" to="/form">📄 Form</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/voice">🎙️ Voice</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
