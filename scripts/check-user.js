require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');
const bcrypt = require('bcrypt');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'admin@medical.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.connection.close();
      return;
    }

    console.log('\n📋 User Details:');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('Password Hash:', user.password ? user.password.substring(0, 20) + '...' : 'NULL');
    
    // Test password
    const testPassword = 'Admin123456';
    console.log('\n🔐 Testing password:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password Match:', isMatch ? '✅ YES' : '❌ NO');
    
    // Also test using the method
    const isMatchMethod = await user.comparePassword(testPassword);
    console.log('Method Match:', isMatchMethod ? '✅ YES' : '❌ NO');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
  }
}

checkUser();
