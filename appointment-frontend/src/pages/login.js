import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch('http://localhost:8000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      console.log(data.user.id)
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user.id);  // Save for doctor-specific fetching
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/doctor/dashboard'); // ✅ Always redirect to doctor dashboard
    } else {
      const errorData = await response.json();
      setError(errorData.detail || 'Login failed');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
