// Test server connection
const http = require('http');

function testConnection(port, path = '/health') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            success: true,
            status: res.statusCode,
            data: response
          });
        } catch (e) {
          resolve({
            success: true,
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        success: false,
        error: 'Request timeout'
      });
    });

    req.setTimeout(5000);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing MarketHub API Server Connection...\n');

  // Test health endpoint
  try {
    console.log('🔍 Testing health endpoint...');
    const healthResult = await testConnection(3002, '/health');
    console.log('✅ Health check successful!');
    console.log('📊 Response:', JSON.stringify(healthResult.data, null, 2));
  } catch (error) {
    console.log('❌ Health check failed:', error.error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test products endpoint
  try {
    console.log('🔍 Testing products endpoint...');
    const productsResult = await testConnection(3002, '/api/products');
    console.log('✅ Products endpoint successful!');
    console.log('📦 Found', productsResult.data.data?.length || 0, 'products');
    if (productsResult.data.data) {
      productsResult.data.data.forEach(product => {
        console.log(`   - ${product.name} ($${product.price})`);
      });
    }
  } catch (error) {
    console.log('❌ Products endpoint failed:', error.error);
  }

  console.log('\n🎯 Test completed!');
}

runTests();
