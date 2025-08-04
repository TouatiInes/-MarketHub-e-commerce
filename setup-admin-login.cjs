const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('🔐 Setting up admin login credentials...');

async function setupAdminLogin() {
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
    
    // Set a simple password for admin user
    const adminEmail = 'admin@markethub.com';
    const newPassword = 'admin123';
    
    console.log('🔍 Looking for admin user...');
    
    // Find admin user
    const adminUser = await db.collection('users').findOne({ 
      email: adminEmail 
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', adminUser.firstName, adminUser.lastName);
    
    // Hash the new password
    console.log('🔐 Hashing new password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update admin password
    await db.collection('users').updateOne(
      { email: adminEmail },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Admin password updated successfully!');
    console.log('\n🎯 Admin Login Credentials:');
    console.log('=' .repeat(50));
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', newPassword);
    console.log('=' .repeat(50));
    
    console.log('\n💡 How to test cart functionality:');
    console.log('1. Go to http://localhost:5174');
    console.log('2. Click "Sign In" or "Login"');
    console.log('3. Use the credentials above');
    console.log('4. Navigate to Products page');
    console.log('5. Click "Add to Cart" on any product');
    console.log('6. Cart should work without errors!');
    
    // Also set up a regular user for testing
    const userEmail = 'user1@example.com';
    const userPassword = 'user123';
    
    console.log('\n🔐 Setting up test user credentials...');
    const hashedUserPassword = await bcrypt.hash(userPassword, saltRounds);
    
    await db.collection('users').updateOne(
      { email: userEmail },
      { 
        $set: { 
          password: hashedUserPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Test user password updated!');
    console.log('\n🎯 Test User Login Credentials:');
    console.log('=' .repeat(50));
    console.log('📧 Email:', userEmail);
    console.log('🔑 Password:', userPassword);
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed');
    process.exit(0);
  }
}

setupAdminLogin();
