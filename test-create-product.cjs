const http = require('http');

console.log('🧪 Testing Create Product API...');

// Sample product data with unique SKU
const productData = {
  name: "Test Product " + Date.now(),
  description: "This is a test product created via API",
  shortDescription: "Test product for API testing",
  price: 99.99,
  originalPrice: 129.99,
  category: "electronics",
  brand: "TestBrand",
  sku: "TEST-" + Date.now(),
  images: [
    {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      alt: "Test Product",
      isPrimary: true
    }
  ],
  inventory: {
    stock: 50,
    lowStockThreshold: 10,
    trackInventory: true
  },
  tags: ["test", "api", "electronics"],
  featured: false,
  status: "active"
};

const postData = JSON.stringify(productData);

const options = {
  hostname: 'localhost',
  port: 9876,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    // Add a mock authorization header (you may need to adjust this)
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
      
      if (res.statusCode === 201) {
        console.log('✅ Product created successfully!');
        console.log('📦 Product Name:', parsed.data?.name);
        console.log('🏷️ SKU:', parsed.data?.sku);
        console.log('🔗 Slug:', parsed.data?.seo?.slug);
      } else {
        console.log('❌ Product creation failed');
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
