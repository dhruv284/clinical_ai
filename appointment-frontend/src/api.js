import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dhruv2842-clinic-ai-backend.hf.space',  // ✅ change if you deploy elsewhere
});

// 📤 Voice-based appointment (STT + booking)
export const uploadVoice = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  return await API.post('/appointments/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 📝 Manual appointment creation with full scheduling
export const createAppointment = async (data) => {
  return await API.post('/appointments/create', data);
};

// 👤 User registration
export const signup = async (userData) => {
  return await API.post('/users/signup', userData);
};

// 🔐 Login
export const login = async (data) => {
  return await API.post('/users/login', data);
};

// 👨‍⚕️ Fetch available specialists (for dropdown)
export const getSpecialists = async () => {
  return await API.get('/users/specialists');
};

export const getAvailableSlots = async (doctorId, date) => {
  return await API.get(`/doctors/${doctorId}/slots`, {
    params: { date }
  });
};

export const createAppointmentAuto = async (data) => {
  return await API.post('/appointments/auto', data);
};

// inside api.js
export const fetchAppointments = async () => {
  const response = await API.get('/appointments/all');
  return response.data;
};

export const fetchDoctorAppointments = async (doctorId) => {
  const response = await API.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await API.put(`/appointments/${appointmentId}/status`, null, {
    params: { status }
  });
  return response.data;
};