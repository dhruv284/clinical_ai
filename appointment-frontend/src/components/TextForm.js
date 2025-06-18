import React, { useState, useEffect } from 'react';
import {
  createAppointment,
  getSpecialists,
  getAvailableSlots,
  createAppointmentAuto, // ✅ import auto booking API
} from '../api';

const specializations = [
  "Cardiologist", "Neurologist", "Pulmonologist", "Dermatologist",
  "Gastroenterologist", "Endocrinologist", "Psychiatrist", "Opthalmologist",
  "Orthopedic Surgeon", "ENT Specialist", "Pediatrician", "Gynecologist",
  "Oncologist", "Urologist", "Nephrologist", "Hematologist",
  "Rheumatologist", "General physician"
];

const TextForm = ({ onResult }) => {
  const [form, setForm] = useState({
    patient_name: '',
    age: '',
    symptoms: '',
    specialization: '',
    specialist_id: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'pending',
  });

  const [specialists, setSpecialists] = useState([]);
  const [slots, setSlots] = useState([]);
  const [success, setSuccess] = useState(false);
  const [autoMode, setAutoMode] = useState(false); // ✅ Auto mode toggle

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await getSpecialists();
        setSpecialists(res.data || []);
      } catch (err) {
        console.error('Failed to load specialists:', err);
      }
    };
    fetchSpecialists();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.specialist_id || !form.date || autoMode) {
        setSlots([]);
        return;
      }
      try {
        const res = await getAvailableSlots(form.specialist_id, form.date);
        setSlots(res.data.available_slots || []);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setSlots([]);
      }
    };
    fetchSlots();
  }, [form.specialist_id, form.date, autoMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'start_time') {
      const endTime = calculateEndTime(value);
      setForm((prev) => ({ ...prev, [name]: value, end_time: endTime }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === 'specialization') {
        setForm((prev) => ({
          ...prev,
          specialization: value,
          specialist_id: '',
          start_time: '',
          end_time: '',
        }));
        setSlots([]);
      }

      if (name === 'specialist_id' || name === 'date') {
        setForm((prev) => ({
          ...prev,
          [name]: value,
          start_time: '',
          end_time: '',
        }));
      }
    }
  };

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date();
    start.setHours(hours);
    start.setMinutes(minutes + 30);
    return start.toTimeString().slice(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      if (autoMode) {
        // ✅ Auto booking using AI
        const res = await createAppointmentAuto({
          patient_name: form.patient_name,
          age: parseInt(form.age),
          symptoms: form.symptoms,
        });
        onResult(res.data);
      } else {
        // 🛠️ Manual appointment
        const payload = {
          ...form,
          age: parseInt(form.age),
          specialist_id: parseInt(form.specialist_id),
          specialist: form.specialization,
        };
        delete payload.specialization;

        const res = await createAppointment(payload);
        onResult(res.data);
      }

      setSuccess(true);
      setForm({
        patient_name: '',
        age: '',
        symptoms: '',
        specialization: '',
        specialist_id: '',
        date: '',
        start_time: '',
        end_time: '',
        status: 'pending',
      });
      setSlots([]);
    } catch (err) {
      console.error('Appointment creation failed:', err);
      alert('❌ Appointment creation failed.');
    }
  };

  const filteredDoctors = form.specialization
    ? specialists.filter((s) => s.specialization === form.specialization)
    : [];

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-4 text-center">📝 Book Appointment</h4>

        {/* ✅ Auto booking toggle */}
        <div className="form-check form-switch mb-4 text-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="autoBook"
            checked={autoMode}
            onChange={() => setAutoMode(!autoMode)}
          />
          <label className="form-check-label" htmlFor="autoBook">
            Use AI to auto-book doctor and time slot
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="patient_name"
              className="form-control"
              value={form.patient_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Age */}
          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-control"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Symptoms */}
          <div className="mb-3">
            <label className="form-label">Symptoms</label>
            <input
              type="text"
              name="symptoms"
              className="form-control"
              value={form.symptoms}
              onChange={handleChange}
              required
            />
          </div>

          {/* Manual mode fields only if auto mode is off */}
          {!autoMode && (
            <>
              {/* Specialization */}
              <div className="mb-3">
                <label className="form-label">Specialization</label>
                <select
                  name="specialization"
                  className="form-select"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Specialization --</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              {filteredDoctors.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Choose Doctor</label>
                  <select
                    name="specialist_id"
                    className="form-select"
                    value={form.specialist_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Doctor --</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.full_name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date */}
              <div className="mb-3">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Slots */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Available Time Slots</label>
                  <select
                    name="start_time"
                    className="form-select"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                    disabled={slots.length === 0}
                  >
                    <option value="">-- Select Time --</option>
                    {slots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    className="form-control"
                    value={form.end_time}
                    readOnly
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="text-center">
            <button type="submit" className="btn btn-success px-4">
              ✅ Book Appointment
            </button>
          </div>
        </form>

        {success && (
          <div className="alert alert-success mt-3 text-center">
            ✅ Appointment booked successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default TextForm;
