const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/markethub');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/markethub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check your .env file for correct MONGODB_URI');
    console.log('3. For local MongoDB: mongodb://localhost:27017/markethub');
    console.log('4. For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/markethub');
  }
  
  process.exit(0);
};

testConnection();
