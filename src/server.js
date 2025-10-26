require('dotenv').config();
const app = require('./app');
const { testConnection, initializeDatabase } = require('./models/database');

const PORT = process.env.PORT || 3000;

// Start server with database initialization
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (isConnected) {
      // Initialize database tables
      await initializeDatabase();
      
      // Start server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
      });
    } else {
      console.log('⚠️  Server started without database connection');
      console.log('💡 You can still test endpoints, but data operations will fail');
      
      // Start server anyway (useful for testing)
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (No DB)`);
        console.log(`📍 http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();