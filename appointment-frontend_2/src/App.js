// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import AppointmentForm from './components/TextForm';
import VoiceRecorder from './components/VoiceRecorder';
import SignUp from './pages/SignUp';
import Login from './pages/login';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/form" element={<AppointmentForm />} />
          <Route path="/voice" element={<VoiceRecorder />} />
          <Route path="/appointment/text" element={<AppointmentForm />} />
          <Route path="/appointment/voice" element={<VoiceRecorder />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
