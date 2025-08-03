const net = require('net');
const { spawn } = require('child_process');

// Function to check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port <= startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available port found');
}

// Start server with available port
async function startServer() {
  try {
    console.log('🔍 Finding available port...');
    const port = await findAvailablePort(3000);
    
    console.log(`✅ Found available port: ${port}`);
    console.log(`🚀 Starting MarketHub API server on port ${port}...`);
    
    // Set environment variable
    process.env.PORT = port;
    
    // Start the server
    require('./server.js');
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
