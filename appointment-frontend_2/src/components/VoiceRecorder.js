// src/components/VoiceRecorder.js
import React, { useState, useRef } from 'react';
import Recorder from 'recorder-js';
import axios from 'axios';

function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [blobURL, setBlobURL] = useState(null);
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
    recorder.init(stream);
    recorderRef.current = recorder;

    await recorder.start();
    setRecording(true);
  };

  const stopRecording = async () => {
    const { blob } = await recorderRef.current.stop();
    setRecording(false);

    const audioURL = URL.createObjectURL(blob);
    setBlobURL(audioURL);

    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");

    try {
      const response = await axios.post("http://127.0.0.1:8000/appointments/voice", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onResult && onResult(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed. WAV encoding might be invalid.");
    }

    // Clean up
    audioStreamRef.current.getTracks().forEach(track => track.stop());
    audioContextRef.current.close();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">
        <h4 className="text-center mb-4">🎤 Voice Appointment Form</h4>
        
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
      </div>
    </div>
  );
}

export default VoiceRecorder;
