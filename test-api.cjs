// Simple API test script
const http = require('http');

const testEndpoints = [
  { path: '/health', method: 'GET', description: 'Health check' },
  { path: '/api/products', method: 'GET', description: 'Get all products' },
  { path: '/api/categories', method: 'GET', description: 'Get all categories' }
];

const testAPI = async () => {
  console.log('🧪 Testing MarketHub API...\n');

  for (const endpoint of testEndpoints) {
    try {
      const options = {
        hostname: 'localhost',
        port: 3002,
        path: endpoint.path,
        method: endpoint.method,
        timeout: 5000
      };

      const response = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              data: data
            });
          });
        });

        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.setTimeout(5000);
        req.end();
      });

      if (response.statusCode === 200) {
        console.log(`✅ ${endpoint.description}: OK (${response.statusCode})`);
        
        // Parse and show sample data for products
        if (endpoint.path === '/api/products') {
          try {
            const products = JSON.parse(response.data);
            console.log(`   📦 Found ${products.data?.length || 0} products`);
          } catch (e) {
            console.log('   📦 Response received');
          }
        }
        
        // Parse and show sample data for categories
        if (endpoint.path === '/api/categories') {
          try {
            const categories = JSON.parse(response.data);
            console.log(`   📂 Found ${categories.data?.length || 0} categories`);
          } catch (e) {
            console.log('   📂 Response received');
          }
        }
      } else {
        console.log(`❌ ${endpoint.description}: Failed (${response.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.description}: Error - ${error.message}`);
    }
  }

  console.log('\n🎯 API Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. If all tests passed, your MongoDB backend is ready!');
  console.log('2. You can now connect your React frontend to the API');
  console.log('3. Use these credentials to test:');
  console.log('   Admin: admin@markethub.com / admin123');
  console.log('   User: user1@example.com / password123');
  console.log('\n🌐 API Base URL: http://localhost:3002');
};

testAPI();
