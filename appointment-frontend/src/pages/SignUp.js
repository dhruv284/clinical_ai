import React, { useState } from 'react';
import { signup } from '../api';

const specializations = [
  'Cardiologist', 'Neurologist', 'Pulmonologist', 'Dermatologist',
  'Gastroenterologist', 'Endocrinologist', 'Psychiatrist', 'Opthalmologist',
  'Orthopedic Surgeon', 'ENT Specialist', 'Pediatrician', 'Gynecologist',
  'Oncologist', 'Urologist', 'Nephrologist', 'Hematologist',
  'Rheumatologist', 'General physician'
];

const Signup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    specialization: '',
    work_start: '',
    work_end: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(form);
      alert('✅ Account created!');
      console.log(res.data);
    } catch (err) {
      console.error('Signup failed:', err);
      alert('❌ Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      <div
        className="card shadow-sm p-4 rounded-4"
        style={{ width: '100%', maxWidth: '440px' }} // 🔹 Slightly smaller box
      >
        <div className="text-center mb-3">
          <h4 className="fw-semibold">📝 Doctor Signup</h4>
          <p className="text-muted small">Create your profile to start accepting appointments</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <select
              className="form-select"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select specialization</option>
              {specializations.map((spec, idx) => (
                <option key={idx} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Work Start</label>
              <input
                type="time"
                className="form-control"
                name="work_start"
                value={form.work_start}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Work End</label>
              <input
                type="time"
                className="form-control"
                name="work_end"
                value={form.work_end}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Signup;
