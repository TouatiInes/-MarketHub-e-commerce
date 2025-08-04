const http = require('http');

console.log('🛒 Testing Cart API...');

// First, let's test if we can get a valid product ID from the products API
async function getProductId() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 9876,
      path: '/api/products?limit=1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success && parsed.data.length > 0) {
            const productId = parsed.data[0]._id;
            console.log('✅ Got product ID:', productId);
            resolve(productId);
          } else {
            reject(new Error('No products found'));
          }
        } catch (e) {
          reject(new Error('Failed to parse products response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test cart API with a valid product ID
async function testCartAPI() {
  try {
    const productId = await getProductId();
    
    console.log('🧪 Testing add to cart with product ID:', productId);
    
    // Test data for cart
    const cartData = {
      productId: productId,
      quantity: 1
    };

    const postData = JSON.stringify(cartData);

    const options = {
      hostname: 'localhost',
      port: 9876,
      path: '/api/auth/cart',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        // Note: This will fail without proper authentication
        'Authorization': 'Bearer mock-token'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📦 Response Body:');
        try {
          const parsed = JSON.parse(data);
          console.log(JSON.stringify(parsed, null, 2));
          
          if (res.statusCode === 401) {
            console.log('ℹ️ Expected 401 - Authentication required for cart operations');
          } else if (res.statusCode === 400) {
            console.log('ℹ️ 400 error - Check if ObjectId validation is working');
          } else if (res.statusCode === 500) {
            console.log('❌ 500 error - Server issue, check ObjectId conversion');
          }
        } catch (e) {
          console.log('Raw response:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
    });

    req.setTimeout(10000, () => {
      console.error('❌ Request Timeout');
      req.destroy();
    });

    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCartAPI();
