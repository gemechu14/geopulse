/**
 * Socket.IO Test Script for GeoPulse Backend
 * 
 * Usage: node test-socket.js
 * 
 * Make sure to install socket.io-client first:
 * npm install socket.io-client
 */

const io = require('socket.io-client');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const USER_ID = parseInt(process.argv[2]) || 1;

console.log('🔌 Connecting to Socket.IO server...');
console.log(`   Server: ${SERVER_URL}`);
console.log(`   User ID: ${USER_ID}\n`);

// Connect to the server
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to server');
  console.log(`   Socket ID: ${socket.id}\n`);
  
  // Join user room
  console.log(`📥 Joining user room for user ${USER_ID}...`);
  socket.emit('join:user', { userId: USER_ID });
  
  // Send a test location update after 1 second
  setTimeout(() => {
    console.log('\n📍 Sending test location update...');
    socket.emit('location:update', {
      userId: USER_ID,
      latitude: 40.7128,
      longitude: -74.006
    });
  }, 1000);
});

socket.on('disconnect', () => {
  console.log('\n❌ Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
});

socket.on('reconnect_error', (error) => {
  console.error('❌ Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Failed to reconnect');
  process.exit(1);
});

// Listen for location updates
socket.on('location:update', (data) => {
  console.log('\n📍 Location Update Received:');
  console.log('   ', JSON.stringify(data, null, 2));
});

// Listen for geofence enter events
socket.on('geofence:enter', (data) => {
  console.log('\n🚪 Geofence Enter Event:');
  console.log('   ', JSON.stringify(data, null, 2));
});

// Listen for geofence exit events
socket.on('geofence:exit', (data) => {
  console.log('\n🚪 Geofence Exit Event:');
  console.log('   ', JSON.stringify(data, null, 2));
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});

// Keep the script running
console.log('📡 Listening for events... (Press Ctrl+C to exit)\n');

