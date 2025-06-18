import React, { useState } from 'react';
import { signup } from '../api';

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
    <div className="container mt-5">
      <h2 className="mb-4">📝 Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="full_name" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Specialization</label>
          <select className="form-select" name="specialization" value={form.specialization} onChange={handleChange} required>
            <option value="">Select specialization</option>
            <option>Cardiologist</option>
            <option>Neurologist</option>
            <option>Pulmonologist</option>
            <option>Dermatologist</option>
            <option>Gastroenterologist</option>
            <option>Endocrinologist</option>
            <option>Psychiatrist</option>
            <option>Opthalmologist</option>
            <option>Orthopedic Surgeon</option>
            <option>ENT Specialist</option>
            <option>Pediatrician</option>
            <option>Gynecologist</option>
            <option>Oncologist</option>
            <option>Urologist</option>
            <option>Nephrologist</option>
            <option>Hematologist</option>
            <option>Rheumatologist</option>
            <option>General physician</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Work Start Time</label>
          <input type="time" className="form-control" name="work_start" value={form.work_start} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Work End Time</label>
          <input type="time" className="form-control" name="work_end" value={form.work_end} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
