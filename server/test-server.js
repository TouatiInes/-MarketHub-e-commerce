// Minimal test server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Test server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test products route
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: 'test1',
        name: 'Test Product 1',
        price: 99.99,
        category: 'electronics'
      },
      {
        _id: 'test2',
        name: 'Test Product 2',
        price: 149.99,
        category: 'fashion'
      }
    ],
    message: 'Test products endpoint working'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});
