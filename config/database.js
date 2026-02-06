const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Try to use Google DNS for better resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    // Try connection with extended options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error.message);
    
    // If SRV fails, try to provide more helpful error
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error('\n🔍 DNS Resolution Issue Detected');
      console.error('💡 Try these solutions:');
      console.error('1. Restart your computer');
      console.error('2. Flush DNS: ipconfig /flushdns (in admin PowerShell)');
      console.error('3. Check if MongoDB Compass connection string is exactly the same');
      console.error('4. Try connecting from different network (mobile hotspot)');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
