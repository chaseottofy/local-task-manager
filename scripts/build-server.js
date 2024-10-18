// Runs compressed production build in /dist
// npm run build:server
const http = require('node:http');
const path = require('node:path');
const compression = require('compression');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, '../dist');
// Enable gzip compression
app.use(compression());
// Serve static files from the dist directory
app.use(express.static(DIST_DIR));
// For any GET request, send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});
// Create the server
const server = http.createServer(app);
// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
