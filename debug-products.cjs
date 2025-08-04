const mongoose = require('mongoose');

console.log('🔍 Debugging Products Route...');

async function debugProducts() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/markethub', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000
    });
    console.log('✅ MongoDB connected');

    // Import Product model
    console.log('📦 Loading Product model...');
    const Product = require('./server/models/Product');
    console.log('✅ Product model loaded');

    // Test the exact query from the products route
    console.log('🔍 Testing products query...');
    
    const query = { status: 'active' };
    const sortOptions = { createdAt: -1 };
    const page = 1;
    const limit = 12;
    
    console.log('📋 Query:', query);
    console.log('📋 Sort:', sortOptions);
    console.log('📋 Pagination:', { page, limit });
    
    // Execute the same query as in the route
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName')
      .select('-reviews');
    
    console.log('✅ Query successful!');
    console.log('📊 Found products:', products.length);
    
    if (products.length > 0) {
      console.log('📦 Sample product:');
      console.log('- ID:', products[0]._id);
      console.log('- Name:', products[0].name);
      console.log('- Price:', products[0].price);
      console.log('- Status:', products[0].status);
    }
    
    // Test count query
    const total = await Product.countDocuments(query);
    console.log('📊 Total count:', total);
    
    console.log('🎉 All queries successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  }
}

debugProducts();
