import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://dhruv2842-clinic-ai-backend.hf.space/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/doctor/dashboard');
    } else {
      const errorData = await response.json();
      setError(errorData.detail || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-5 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">🔐 Doctor Login</h3>
          <p className="text-muted mb-0">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
