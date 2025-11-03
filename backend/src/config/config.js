require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 8001,
    env: process.env.NODE_ENV || 'development',
    isDevlopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // Database Configuration
  db: {
    connection_string: process.env.CONNECTION_STRING || 'localhost-mongodb'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'mysecretkeyforjwtwhichshouldbechangedinproduction',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
  }
};

module.exports = config;
