import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Initialize
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// API Routes (must come before static files)
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React static files from frontend-dist
const frontendPath = path.join(__dirname, 'frontend-dist');
app.use(express.static(frontendPath));

// Add this route before the static files but after other API routes
app.get('/api/files', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
    
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error('Error reading uploads directory:', err);
        return res.status(500).json({ error: 'Unable to read files' });
      }
  
      const fileList = files.map(file => ({
        name: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadDir, file)).size,
        uploaded: fs.statSync(path.join(uploadDir, file)).birthtime
      }));
  
      res.json(fileList);
    });
  });


// Add this with your other routes (before static files)
app.get('/api/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    
    if (fs.existsSync(filePath)) {
      // Set proper headers for download
      res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });
// IMPORTANT: Catch-all route for React SPA - must be LAST
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});



// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));