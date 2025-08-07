const mongoose = require('mongoose');

console.log('🖼️ Checking product image data structure...');

async function checkProductImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/markethub', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000
    });
    console.log('✅ MongoDB connected');

    const db = mongoose.connection.db;
    
    // Get sample products to check image structure
    const products = await db.collection('products').find({}).limit(3).toArray();
    
    console.log(`\n📊 Found ${products.length} products. Checking image structures:\n`);
    console.log('=' .repeat(80));
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. Product: ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Image field: ${JSON.stringify(product.image, null, 2)}`);
      console.log(`   Images field: ${JSON.stringify(product.images, null, 2)}`);
      console.log(`   Image type: ${typeof product.image}`);
      console.log(`   Images type: ${typeof product.images}`);
      console.log(`   Images is array: ${Array.isArray(product.images)}`);
      
      if (product.images && Array.isArray(product.images)) {
        console.log(`   Images array length: ${product.images.length}`);
        if (product.images.length > 0) {
          console.log(`   First image: ${JSON.stringify(product.images[0], null, 2)}`);
        }
      }
      
      console.log('-'.repeat(40));
    });
    
    console.log('\n💡 Analysis:');
    console.log('- Check if products have "image" field (string) or "images" field (array)');
    console.log('- ProductCard expects product.image to be a string URL');
    console.log('- If images is array, we may need to use images[0].url or images[0]');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

checkProductImages();
