import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';
import { connectPostgreSQL, connectMongoDB } from './config/database';
import { initializeSocketIO } from './config/socket';
import { GeofencingService } from './services/geofencing.service';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(httpServer);

// Initialize GeofencingService with Socket.IO instance
// This sets the Socket.IO instance for all GeofencingService instances
GeofencingService.setSocketIO(io);

// Connect to databases
const startServer = async (): Promise<void> => {
  try {
    await connectPostgreSQL();
    await connectMongoDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

