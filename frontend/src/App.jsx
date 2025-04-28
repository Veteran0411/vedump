import { useState } from 'react';
import FileList from './components/FileList';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    // For both single file and folder selection
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Please select file(s) or folder first!');
      return;
    }

    const formData = new FormData();
    
    // Append all files
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${baseURL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(`Upload successful! ${data.count} file(s) uploaded`);
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="app">
      <h1>Simple Cloud Storage</h1>
      
      <div className="upload-section">
        <input 
          type="file" 
          onChange={handleFileChange}
          webkitdirectory="true"  // Enable folder selection
          directory="true"        // Fallback
          multiple                // Allow multiple files
        />
        <button onClick={handleUpload}>Upload</button>
        {message && <p className="message">{message}</p>}
      </div>
      
      <FileList />
    </div>
  );
}

export default App;