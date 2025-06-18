// src/components/VoiceRecorder.js
import React, { useState, useRef } from 'react';
import Recorder from 'recorder-js';
import axios from 'axios';

function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [blobURL, setBlobURL] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const audioContextRef = useRef(null);
  const recorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const recorder = new Recorder(audioContext);
    await recorder.init(stream);
    recorderRef.current = recorder;

    await recorder.start();
    setRecording(true);
    setResponseData(null); // Clear previous response
  };

  const stopRecording = async () => {
    const { blob } = await recorderRef.current.stop();
    setRecording(false);

    const audioURL = URL.createObjectURL(blob);
    setBlobURL(audioURL);

    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
    try {
      const response = await axios.post("http://localhost:8000/appointments/voice", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    
      setResponseData(response.data);
      if (onResult) onResult(response.data);
    
    } catch (err) {
      console.error("Upload error:", err);
    
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data?.detail || 
        "❌ Upload failed. WAV encoding might be invalid or server error.";
    
      alert(errorMessage);
    }

    // Clean up
    audioStreamRef.current.getTracks().forEach(track => track.stop());
    audioContextRef.current.close();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">
        <h4 className="text-center mb-4">🎤 Voice Appointment Form</h4>

        <div className="alert alert-info">
          <strong>Try saying Like</strong> "My name is Ravi Kumar. I am 20 years old and I am suffering from fever."
        </div>

        <div className="d-flex justify-content-center mb-3">
          <button
            onClick={startRecording}
            disabled={recording}
            className="btn btn-primary me-3"
          >
            🎙️ Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!recording}
            className="btn btn-danger"
          >
            ⏹️ Stop & Upload
          </button>
        </div>

        {blobURL && (
          <div className="text-center mt-4">
            <p className="fw-bold">🔊 Preview:</p>
            <audio controls src={blobURL} className="w-100" />
          </div>
        )}

        {responseData && (
          <div className="alert alert-success mt-4">
            <h5 className="fw-bold">🧾 Server Response:</h5>
            <p><strong>Message:</strong> {responseData.message}</p>
            <p><strong>Predicted Specialist:</strong> {responseData.predicted_specialist}</p>
            <p><strong>Similarity Score:</strong> {responseData.similarity_score}</p>
            <h6 className="mt-3">📄 Appointment Details:</h6>
            <ul>
              <li><strong>Name:</strong> {responseData.appointment?.patient_name}</li>
              <li><strong>Age:</strong> {responseData.appointment?.age}</li>
              <li><strong>Symptoms:</strong> {responseData.appointment?.symptoms}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceRecorder;
