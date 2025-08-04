const mongoose = require('mongoose');

console.log('👥 Checking users in database...');

async function checkUsers() {
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
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`\n📊 Found ${users.length} users in database:\n`);
    console.log('=' .repeat(80));
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('\n💡 You need to create an account to test cart functionality:');
      console.log('   1. Go to http://localhost:5174');
      console.log('   2. Click "Sign Up" or "Register"');
      console.log('   3. Create a new account');
      console.log('   4. Then try adding products to cart');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role || 'user'}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Cart items: ${user.cart ? user.cart.length : 0}`);
        console.log(`   Wishlist items: ${user.wishlist ? user.wishlist.length : 0}`);
        console.log('-'.repeat(40));
      });
      
      console.log('\n💡 To test cart functionality:');
      console.log('   1. Go to http://localhost:5174');
      console.log('   2. Sign in with one of the existing accounts');
      console.log('   3. Or create a new account');
      console.log('   4. Then try adding products to cart');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

checkUsers();
