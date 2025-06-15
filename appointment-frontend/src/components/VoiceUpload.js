// src/components/VoiceUpload.js
import React, { useState } from 'react';
import { uploadVoice } from '../api';

const VoiceUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const res = await uploadVoice(file);
    onResult(res.data);
  };

  return (
    <div>
      <input type="file" accept="audio/wav" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Voice</button>
    </div>
  );
};

export default VoiceUpload;
