const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3131;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume.html'));
});

app.get('/project/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'project.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
