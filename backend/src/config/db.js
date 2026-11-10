const mongoose = require('mongoose');
const logger = require('./logger');
const User = require('../models/User.model');

const seedDemoUser = async () => {
  const { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } = process.env;
  if (!DEMO_USER_EMAIL || !DEMO_USER_PASSWORD) return;

  const existingUser = await User.findOne({ email: DEMO_USER_EMAIL.toLowerCase() });
  if (existingUser) {
    logger.info(`✅ Demo user already exists: ${DEMO_USER_EMAIL}`);
    return;
  }

  await User.create({
    name: process.env.DEMO_USER_NAME || 'Demo User',
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
    role: 'candidate',
  });
  logger.info(`✅ Demo user created: ${DEMO_USER_EMAIL}`);
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDemoUser();
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    logger.warn('⚠️ Server continuing without MongoDB. Some features will be disabled.');
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

module.exports = connectDB;
