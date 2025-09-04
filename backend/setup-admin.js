const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-connect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
    } else {
      // Create admin user
      const adminUser = new User({
        email: 'admin@collegeconnect.com',
        registrationNumber: 'ADMIN001',
        name: 'System Administrator',
        phone: '1234567890',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Admin user created:', adminUser.email);
    }

    // List all users
    const allUsers = await User.find({}, 'email name role isActive');
    console.log('\n📋 Current Users:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${user.role} - Active: ${user.isActive}`);
    });

    console.log('\n🎉 Setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setupAdmin();
