// src/pages/Home.js
import React, { useState } from 'react';
import TextForm from '../components/TextForm';
import VoiceRecorder from '../components/VoiceRecorder';
import Result from './Result';

function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">🩺 Book Your Appointment</h2>
        <p className="text-muted fs-5">Choose your preferred method to schedule a consultation</p>
      </div>

      {/* Text Form Booking */}
      <div className="card shadow-sm rounded-4 mb-5 border-0">
        <div className="card-body p-4">
          <h5 className="fw-semibold mb-3">📝 Fill Appointment Form</h5>
          <TextForm onResult={setResult} />
        </div>
      </div>

      {/* Voice Booking */}
      <div className="card shadow-sm rounded-4 mb-5 border-0 bg-light-subtle">
        <div className="card-body p-4">
          <h5 className="fw-semibold mb-3">🎤 Or Book Using Your Voice</h5>
          <VoiceRecorder onResult={setResult} />
        </div>
      </div>

      {/* AI Result */}
      {result && (
        <div className="card bg-light rounded-4 shadow-sm p-4 border-0">
          <h5 className="text-success fw-bold mb-3">✅ Appointment Details</h5>
          <Result data={result} />
        </div>
      )}
    </div>
  );
}

export default Home;
