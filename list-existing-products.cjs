const mongoose = require('mongoose');

console.log('📋 Listing all existing products to avoid conflicts...');

async function listProducts() {
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
    
    // Get all products
    const products = await db.collection('products').find({}).toArray();
    
    console.log(`\n📊 Found ${products.length} existing products:\n`);
    console.log('=' .repeat(80));
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Slug: ${product.seo?.slug || 'No slug'}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Status: ${product.status}`);
      console.log('-'.repeat(40));
    });
    
    console.log('\n💡 To create new products, use different:');
    console.log('   - SKU (must be unique)');
    console.log('   - Product Name (generates unique slug)');
    console.log('\n📝 Example of available SKUs you can use:');
    console.log('   - LAPTOP-001, PHONE-002, TABLET-003');
    console.log('   - SHIRT-001, PANTS-002, SHOES-003');
    console.log('   - BOOK-001, TOY-002, GAME-003');
    console.log('   - CAMERA-001, SPEAKER-002, MOUSE-003');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

listProducts();
