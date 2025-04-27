import { useState, useEffect } from 'react';
import './FileList.css';

function FileList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/files');
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }
                const data = await response.json();
                setFiles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Add this function to your component
const handleDownload = async (filename) => {
    try {
      const response = await fetch(`/api/download/${filename}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Download failed: ' + error.message);
    }
  };

    if (loading) return <div className="loading">Loading files...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="file-list">
            <h2>Uploaded Files</h2>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Size</th>
                            <th>Uploaded</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                        {file.name}
                                    </a>
                                </td>
                                <td>{formatSize(file.size)}</td>
                                <td>{formatDate(file.uploaded)}</td>
                                <td>
                                    <button onClick={() => window.open(file.url, '_blank')}>
                                        see
                                    </button>
                                </td>
                {/* // Update the download button part */}
                                <td>
                                    <button
                                        className="download-btn"
                                        onClick={() => handleDownload(file.name)}
                                    >
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FileList;