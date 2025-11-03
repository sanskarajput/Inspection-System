const mongoose = require('mongoose');
const config = require('@/config/config');

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(config.db.connection_string);
    console.log('MongoDB connected :', connect.connection.host, connect.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
