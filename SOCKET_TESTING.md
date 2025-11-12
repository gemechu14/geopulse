# Socket.IO Testing Guide

This guide explains how to test the Socket.IO real-time communication features of the GeoPulse backend.

## Prerequisites

1. Make sure your server is running:
   ```bash
   npm run dev
   ```

2. The server should be accessible at `http://localhost:3000` (or your configured port)

## Testing Methods

### Method 1: HTML Test Client (Recommended)

The easiest way to test Socket.IO is using the provided HTML test client.

1. **Open the test client:**
   - Open `test-socket.html` in your web browser
   - Or serve it via a simple HTTP server:
     ```bash
     # Using Python
     python -m http.server 8080
     
     # Using Node.js (if you have http-server installed)
     npx http-server -p 8080
     ```
   - Then open `http://localhost:8080/test-socket.html`

2. **Connect to the server:**
   - Enter your server URL (default: `http://localhost:3000`)
   - Click "Connect"
   - You should see "✅ Connected" status

3. **Test User Rooms:**
   - Enter a User ID (e.g., `1`)
   - Click "Join User Room"
   - This subscribes you to user-specific events

4. **Test Location Updates:**
   - Enter coordinates (latitude, longitude)
   - Click "Send Location Update" to send via Socket.IO
   - Click "Send via REST API" to trigger geofencing checks
   - Watch the events panel for incoming events

5. **Monitor Events:**
   - All received events will appear in the "Received Events" panel
   - Color coding:
     - 🟢 Green: Location updates
     - 🟡 Yellow: Geofence enter events
     - 🔴 Red: Geofence exit events

### Method 2: Node.js Test Script

1. **Install socket.io-client (if not already installed):**
   ```bash
   npm install socket.io-client
   ```

2. **Run the test script:**
   ```bash
   node test-socket.js [userId]
   ```
   
   Example:
   ```bash
   node test-socket.js 1
   ```

3. **What it does:**
   - Connects to the Socket.IO server
   - Joins a user room
   - Sends a test location update
   - Listens for all events (location updates, geofence enter/exit)

### Method 3: Using Postman or REST Client

You can test the REST API endpoints that trigger Socket.IO events:

1. **Send Location Update (triggers geofencing):**
   ```bash
   curl -X POST http://localhost:3000/api/v1/location \
     -H "Content-Type: application/json" \
     -d '{
       "userId": 1,
       "latitude": 40.7128,
       "longitude": -74.006,
       "accuracy": 10
     }'
   ```

   This will:
   - Save the location to MongoDB
   - Trigger geofencing checks
   - Emit Socket.IO events if user enters/exits geofences

2. **Create a Geofence:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/geofences \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Geofence",
       "latitude": 40.7128,
       "longitude": -74.006,
       "radius": 100,
       "userId": 1
     }'
   ```

### Method 4: Browser Console

You can also test directly in the browser console:

1. **Open your browser's developer console** (F12)

2. **Load Socket.IO client:**
   ```html
   <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
   ```

3. **Connect and test:**
   ```javascript
   const socket = io('http://localhost:3000');
   
   socket.on('connect', () => {
     console.log('Connected:', socket.id);
     
     // Join user room
     socket.emit('join:user', { userId: 1 });
     
     // Send location update
     socket.emit('location:update', {
       userId: 1,
       latitude: 40.7128,
       longitude: -74.006
     });
   });
   
   socket.on('location:update', (data) => {
     console.log('Location update:', data);
   });
   
   socket.on('geofence:enter', (data) => {
     console.log('Geofence enter:', data);
   });
   
   socket.on('geofence:exit', (data) => {
     console.log('Geofence exit:', data);
   });
   ```

## Testing Scenarios

### Scenario 1: Basic Connection Test

1. Start the server
2. Open `test-socket.html`
3. Click "Connect"
4. Verify you see "✅ Connected"

### Scenario 2: Location Update Broadcast

1. Open two browser windows with `test-socket.html`
2. Connect both to the server
3. In one window, send a location update
4. Verify the other window receives the update

### Scenario 3: User-Specific Events

1. Connect to the server
2. Join user room for user ID 1
3. Send a location update for user ID 1
4. Verify you receive the location update
5. Send a location update for user ID 2
6. You should still receive it (broadcast to all)

### Scenario 4: Geofence Enter/Exit

1. Create a geofence via API:
   ```bash
   POST /api/v1/geofences
   {
     "name": "Office",
     "latitude": 40.7128,
     "longitude": -74.006,
     "radius": 100,
     "userId": 1
   }
   ```

2. Connect via Socket.IO and join user room

3. Send location updates that:
   - Start outside the geofence
   - Move inside the geofence (should trigger `geofence:enter`)
   - Move outside again (should trigger `geofence:exit`)

   Example sequence:
   ```javascript
   // Outside geofence
   socket.emit('location:update', { userId: 1, latitude: 40.7000, longitude: -74.0000 });
   
   // Inside geofence (within 100m of 40.7128, -74.006)
   socket.emit('location:update', { userId: 1, latitude: 40.7128, longitude: -74.006 });
   
   // Outside again
   socket.emit('location:update', { userId: 1, latitude: 40.7000, longitude: -74.0000 });
   ```

### Scenario 5: REST API Triggers Geofencing

1. Create a geofence
2. Connect via Socket.IO
3. Use the "Send via REST API" button in the HTML client
4. This triggers the geofencing service which will:
   - Check if user is inside/outside geofences
   - Emit Socket.IO events if state changed
   - Log events to MongoDB

## Troubleshooting

### Connection Issues

- **"Connection refused"**: Make sure the server is running
- **CORS errors**: Check `CORS_ORIGIN` in your `.env` file
- **404 errors**: Verify the Socket.IO path is `/socket.io`

### Events Not Received

- Check browser console for errors
- Verify you're connected (check status indicator)
- Make sure you've joined the user room if testing user-specific events
- Check server logs for any errors

### Geofence Events Not Triggering

- Verify the geofence exists in the database
- Check that location coordinates are within the geofence radius
- Ensure you're using the REST API endpoint (not just Socket.IO emit) to trigger geofencing checks
- Check server logs for geofencing service messages

## Server Logs

Watch your server console for:
- `Client connected: [socket-id]` - New client connection
- `User [id] joined their room` - User room join
- `Geofence enter/exit` events being processed

## Next Steps

After testing, you can:
1. Integrate Socket.IO client into your frontend application
2. Customize event handlers for your use case
3. Add authentication to Socket.IO connections
4. Implement rate limiting for location updates
5. Add more event types as needed

