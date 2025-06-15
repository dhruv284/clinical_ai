import React from 'react';
import VoiceRecorder from '../components/VoiceRecorder';

const VoiceAppointment = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-center">🎙️ Book Appointment by Voice</h2>
        <p className="text-muted text-center">Say something like: “My name is Ravi Kumar, I am 20 years old, and I am suffering from fever.”</p>
        <VoiceRecorder />
      </div>
    </div>
  );
};

export default VoiceAppointment;
