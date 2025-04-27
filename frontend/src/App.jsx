import { useState } from 'react';
import FileList from './components/FileList';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(`File uploaded successfully!`);
      // The FileList component will automatically refresh
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="app">
      <h1>Simple Cloud Storage</h1>
      
      <div className="upload-section">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
        {message && <p className="message">{message}</p>}
      </div>
      
      <FileList />
    </div>
  );
}

export default App;