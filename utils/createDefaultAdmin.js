const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.DEFAULT_ADMIN_EMAIL 
    });
    
    if (existingAdmin) {
      console.log(' Default admin already exists');
      return;
    }
    
    // Create default admin
    const adminUser = new User({
      name: 'System Administrator',
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      role: 'admin',
      phone: '03456007890'
    });
    
    await adminUser.save();
    console.log(' Default admin created successfully');
    console.log(` Email: ${process.env.DEFAULT_ADMIN_EMAIL}`);
    console.log(` Password: ${process.env.DEFAULT_ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error(' Error creating default admin:', error.message);
  }
};

module.exports = { createDefaultAdmin };
