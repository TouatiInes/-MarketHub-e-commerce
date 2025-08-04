const mongoose = require('mongoose');

console.log('🧪 Testing Product Model...');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/markethub')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Import Product model
    const Product = require('./server/models/Product');
    console.log('✅ Product model loaded');
    
    // Test basic query
    return Product.find({ status: 'active' }).limit(3);
  })
  .then(products => {
    console.log('✅ Products query successful');
    console.log('📊 Found products:', products.length);
    
    if (products.length > 0) {
      console.log('📦 Sample product:');
      console.log('- Name:', products[0].name);
      console.log('- Price:', products[0].price);
      console.log('- Category:', products[0].category);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Error:', err.message);
    console.log('📋 Stack:', err.stack);
    process.exit(1);
  });
