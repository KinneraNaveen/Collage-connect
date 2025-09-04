const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = new User({
      email: 'admin@collegeconnect.com',
      registrationNumber: 'ADMIN001',
      name: 'System Administrator',
      phone: '+1234567890',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('Default admin user created successfully!');
    console.log('Email: admin@collegeconnect.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createDefaultAdmin();
