// src/components/Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div className="text-center mt-5">
    <h1 className="display-4">Welcome to ClinicAI 🏥</h1>
    <p className="lead mt-3">AI-powered voice and text-based appointment system.</p>
    <Link to="/appointment/voice" className="btn btn-primary me-3">Try Voice Assistant</Link>
    <Link to="/appointment/text" className="btn btn-outline-secondary">Book Manually</Link>
  </div>
);

export default Welcome;
