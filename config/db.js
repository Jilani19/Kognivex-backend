const mongoose = require('mongoose');
const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'admin@kognivex.com' });
    if (!exists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@kognivex.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created default admin user');
    }
  } catch (err) {
    console.error('Default admin setup failed', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
    console.log(`Connected to: ${conn.connection.host}`);
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
