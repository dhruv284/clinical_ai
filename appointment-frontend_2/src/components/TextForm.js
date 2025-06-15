// src/components/TextForm.js
import React, { useState } from 'react';
import { createAppointment } from '../api';

const TextForm = ({ onResult }) => {
  const [form, setForm] = useState({
    patient_name: '',
    age: '',
    symptoms: '',
    preferred_doctor: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAppointment(form);
      onResult(res.data);
    } catch (err) {
      console.error('Appointment creation failed:', err);
      alert('❌ Appointment creation failed.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-4 text-center">📝 Book Appointment via Form</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="patient_name"
              className="form-control"
              placeholder="Enter your name"
              onChange={handleChange}
              value={form.patient_name}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Enter your age"
              onChange={handleChange}
              value={form.age}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Symptoms</label>
            <input
              type="text"
              name="symptoms"
              className="form-control"
              placeholder="Describe your symptoms"
              onChange={handleChange}
              value={form.symptoms}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Preferred Doctor</label>
            <input
              type="text"
              name="preferred_doctor"
              className="form-control"
              placeholder="Optional: e.g. Cardiologist"
              onChange={handleChange}
              value={form.preferred_doctor}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-4">
              ✅ Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextForm;
