// Debug server startup script
const path = require('path');

// Set environment variables
process.env.PORT = process.env.PORT || 3002;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 Starting MarketHub API Server...');
console.log('📍 Port:', process.env.PORT);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('📁 Working Directory:', __dirname);

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔗 MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/markethub');

// Test MongoDB connection first
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/markethub');
    console.log('✅ MongoDB connected successfully');
    await mongoose.disconnect();
    console.log('🔌 MongoDB test connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await testConnection();
    
    console.log('🚀 Starting Express server...');
    
    // Start the main server
    require('./server.js');
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
