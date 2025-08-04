const mongoose = require('mongoose');

console.log('🔍 Checking all products in database...');

async function checkProducts() {
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
    
    // Get all products (including recently created ones)
    const allProducts = await db.collection('products').find({}).toArray();
    
    console.log(`\n📊 Total products in database: ${allProducts.length}\n`);
    console.log('=' .repeat(80));
    
    // Sort by creation date (newest first)
    allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Slug: ${product.seo?.slug || 'No slug'}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Created: ${product.createdAt}`);
      console.log(`   ID: ${product._id}`);
      console.log('-'.repeat(40));
    });
    
    // Check for any products with different status
    const activeProducts = allProducts.filter(p => p.status === 'active');
    const inactiveProducts = allProducts.filter(p => p.status !== 'active');
    
    console.log(`\n📈 Active products: ${activeProducts.length}`);
    console.log(`📉 Inactive products: ${inactiveProducts.length}`);
    
    if (inactiveProducts.length > 0) {
      console.log('\n⚠️ Inactive products:');
      inactiveProducts.forEach(p => {
        console.log(`   - ${p.name} (status: ${p.status})`);
      });
    }
    
    // Check the most recent product
    if (allProducts.length > 0) {
      const newest = allProducts[0];
      console.log('\n🆕 Most recent product:');
      console.log(`   Name: ${newest.name}`);
      console.log(`   Created: ${newest.createdAt}`);
      console.log(`   Status: ${newest.status}`);
      console.log(`   All fields:`, Object.keys(newest));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

checkProducts();
