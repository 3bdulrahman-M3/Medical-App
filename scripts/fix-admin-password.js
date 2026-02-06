require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');
const bcrypt = require('bcrypt');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function fixPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'admin@medical.com' });
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.connection.close();
      return;
    }

    console.log('🔧 Fixing password...');
    
    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123456', salt);
    
    // Update password directly (bypass pre-save hook)
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log('✅ Password fixed successfully!');
    
    // Verify
    const updatedUser = await User.findOne({ email: 'admin@medical.com' }).select('+password');
    const isMatch = await bcrypt.compare('Admin123456', updatedUser.password);
    console.log('✅ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
  }
}

fixPassword();
