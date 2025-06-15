// src/pages/Home.js
import React, { useState } from 'react';
import TextForm from '../components/TextForm';
import VoiceRecorder from '../components/VoiceRecorder';
import Result from './Result';

function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Book an Appointment</h2>

      {/* Form Appointment */}
      <div className="card mb-4 p-4">
        <h5>📝 Fill the Appointment Form</h5>
        <TextForm onResult={setResult} />
      </div>

      {/* Voice Appointment */}
      <div className="card mb-4 p-4">
        <h5>🎤 Or Book Using Voice</h5>
        <VoiceRecorder onResult={setResult} />
      </div>

      {/* Show Result if any */}
      {result && (
        <div className="card p-4 mt-3 bg-light">
          <Result data={result} />
        </div>
      )}
    </div>
  );
}

export default Home;
