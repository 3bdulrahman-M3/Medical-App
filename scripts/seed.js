require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');

// Try to use Google DNS for better resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ MongoDB Atlas Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if Super Admin already exists
    const existingAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (existingAdmin) {
      console.log('Super Admin already exists:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create Super Admin
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@medical.com',
      password: 'Admin123456', // Change this in production!
      role: 'SUPER_ADMIN',
    });

    // Mark password as modified to trigger pre-save hook
    superAdmin.markModified('password');
    await superAdmin.save();
    console.log('✅ Super Admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Password: Admin123456');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Super Admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedSuperAdmin();
