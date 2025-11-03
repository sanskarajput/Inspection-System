function setupProcessHandlers({ server }) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Unhandled Promise Rejection:', err);
    console.log('Shutting down server due to unhandled promise rejection');
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Uncaught Exception:', err);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⛔  SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('👋  Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⛔  SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('👋  Process terminated');
      process.exit(0);
    });
  });
}

module.exports = setupProcessHandlers;
