const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {} = require('module-alias/register');

const config = require('@/config/config');
const setupProcessHandlers = require('@/utils/lifecycle');
const errorHandler = require('@/middlewares/errorHandler');

const connectDB = require('@/config/dbConnection');
const {} = require('@/models/index');

const apis = require('@/apis/index');

class Server {
  constructor() {
    this.app = express();
  }

  async connectDatabase() {
    await connectDB();
  }

  setupMiddleware() {
    // cors
    this.app.use(cors(config.cors));

    // to parse JSON data
    this.app.use(express.json());

    // Request logging
    if (config.server.env === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  setupApis() {
    this.app.get('/health', (req, res) => res.json({ status: 'OK..' }));
    this.app.use('/api', apis);
  }

  setupGlobalErrorHandler() {
    // 404
    this.app.use(/(.*)/, (req, res) => {
      return Response({ res, statusCode: 404, message: `Path ${req.originalUrl} does not exist` });
    });

    this.app.use(errorHandler);
  }

  startServer() {
    this.server = this.app.listen(config.server.port, () => {
      console.log(
        `🛡️  Whatsapp-Inspection-System's backend is listening on http://localhost:${config.server.port}`
      );
      console.log('🚀 Whatsapp-Inspection-System Backend Server Started Successfully !');
    });

    setupProcessHandlers({ server: this.server });
  }

  async run() {
    await this.connectDatabase();
    this.setupMiddleware();
    this.setupApis();
    this.startServer();
  }
}

module.exports = Server;
