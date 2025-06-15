import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const uploadVoice = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  return await API.post('/appointments/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createAppointment = async (data) => {
  return await API.post('/appointments/create', data);
};
