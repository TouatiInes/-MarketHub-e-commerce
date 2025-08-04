const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🚀 Starting minimal server test...');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Simple products route
app.get('/api/products', async (req, res) => {
  try {
    console.log('📊 Products route called');
    
    // Connect to MongoDB with timeout options
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 Connecting to MongoDB...');
      await mongoose.connect('mongodb://localhost:27017/markethub', {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        bufferMaxEntries: 0
      });
      console.log('✅ MongoDB connected');
    }
    
    // Simple query
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).limit(5).toArray();
    
    console.log('📦 Found products:', products.length);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
    
  } catch (error) {
    console.error('❌ Products error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

const PORT = 9876;
const server = app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
  server.close(() => process.exit(1));
});
