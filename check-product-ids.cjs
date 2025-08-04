const mongoose = require('mongoose');

console.log('📦 Checking product IDs format...');

async function checkProductIds() {
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
    
    // Get sample products
    const products = await db.collection('products').find({}).limit(5).toArray();
    
    console.log(`\n📊 Found ${products.length} products. Checking ID formats:\n`);
    console.log('=' .repeat(80));
    
    products.forEach((product, index) => {
      const id = product._id;
      const idString = id.toString();
      
      console.log(`${index + 1}. Product: ${product.name}`);
      console.log(`   ID: ${id}`);
      console.log(`   ID Type: ${typeof id}`);
      console.log(`   ID String: ${idString}`);
      console.log(`   String Length: ${idString.length}`);
      console.log(`   Is Valid ObjectId Length: ${idString.length === 24}`);
      console.log(`   Is Hex String: ${/^[0-9a-fA-F]{24}$/.test(idString)}`);
      
      // Test ObjectId creation
      try {
        const testObjectId = new mongoose.Types.ObjectId(idString);
        console.log(`   ✅ ObjectId Creation: SUCCESS`);
      } catch (error) {
        console.log(`   ❌ ObjectId Creation: FAILED - ${error.message}`);
      }
      
      console.log('-'.repeat(40));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

checkProductIds();
