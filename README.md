# GeoPulse Backend

Production-ready backend system for location tracking and geofencing built with Node.js, TypeScript, Express.js, PostgreSQL, MongoDB, and Socket.IO.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Architecture](#architecture)

## Features

- **User Management**: Complete CRUD operations for users with JWT authentication support
- **Location Tracking**: Record and retrieve user location updates
- **Geofencing**: Create, manage, and monitor geofences with automatic enter/exit detection
- **Real-time Updates**: WebSocket support via Socket.IO for live location and geofence events
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Comprehensive Testing**: Unit and integration tests with Jest
- **Production Ready**: Error handling, validation, logging, and security best practices

## Tech Stack

- **Runtime**: Node.js (LTS)
- **Language**: TypeScript
- **Framework**: Express.js
- **Databases**:
  - PostgreSQL (via Sequelize) - Relational data (users, sessions, geofences)
  - MongoDB (via Mongoose) - Event logs (location events, geofence events)
- **Real-time**: Socket.IO
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **PostgreSQL** (v12 or higher)
- **MongoDB** (v5.x or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd GeoPulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file** with your database credentials and other settings (see [Configuration](#configuration))

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=geopulse
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/geopulse

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Swagger Configuration
SWAGGER_HOST=localhost:3000
SWAGGER_SCHEMES=http
```

## Database Setup

### PostgreSQL Setup

1. **Create the database**:
   ```bash
   createdb geopulse
   ```
   Or using PostgreSQL CLI:
   ```sql
   CREATE DATABASE geopulse;
   ```

2. **Run migrations**:
   ```bash
   npm run migrate
   ```

   This will create the following tables:
   - `users` - User accounts
   - `sessions` - User sessions
   - `geofences` - Geofence definitions

### MongoDB Setup

MongoDB will automatically create the database and collections when the application starts. No manual setup is required.

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

1. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration

## API Documentation

Once the server is running, you can access the interactive API documentation at:

**http://localhost:3000/api-docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Example requests
- Try-it-out functionality

## API Endpoints

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Location

- `POST /api/v1/location` - Record location update
- `GET /api/v1/location/:userId/history` - Get location history for a user
- `GET /api/v1/location/:userId/latest` - Get latest location for a user

### Geofences

- `GET /api/v1/geofences` - Get all geofences
- `GET /api/v1/geofences/:id` - Get geofence by ID
- `POST /api/v1/geofences` - Create a new geofence
- `PUT /api/v1/geofences/:id` - Update geofence
- `DELETE /api/v1/geofences/:id` - Delete geofence
- `GET /api/v1/geofences/user/:userId` - Get all geofences for a user

### Health Check

- `GET /health` - Server health check

## WebSocket Events

The application uses Socket.IO for real-time communication. Connect to `http://localhost:3000` using a Socket.IO client.

### Client-to-Server Events

- `join:user` - Join user-specific room
  ```javascript
  socket.emit('join:user', { userId: 123 });
  ```

- `leave:user` - Leave user-specific room
  ```javascript
  socket.emit('leave:user', { userId: 123 });
  ```

- `location:update` - Send location update (optional, server processes via REST API)
  ```javascript
  socket.emit('location:update', {
    userId: 123,
    latitude: 40.7128,
    longitude: -74.006
  });
  ```

### Server-to-Client Events

- `location:update` - Broadcasted when a user's location is updated
  ```javascript
  socket.on('location:update', (data) => {
    console.log('Location update:', data);
    // data: { userId, latitude, longitude, timestamp }
  });
  ```

- `geofence:enter` - Emitted when a user enters a geofence
  ```javascript
  socket.on('geofence:enter', (data) => {
    console.log('Geofence enter:', data);
    // data: { userId, geofenceId, location: { latitude, longitude }, timestamp }
  });
  ```

- `geofence:exit` - Emitted when a user exits a geofence
  ```javascript
  socket.on('geofence:exit', (data) => {
    console.log('Geofence exit:', data);
    // data: { userId, geofenceId, location: { latitude, longitude }, timestamp }
  });
  ```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Test Structure

- **Unit Tests**: `src/tests/unit/` - Test utility functions and services
- **Integration Tests**: `src/tests/integration/` - Test API endpoints and database operations

## Project Structure

```
GeoPulse/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database connections
│   │   ├── socket.ts        # Socket.IO setup
│   │   └── swagger.ts       # Swagger configuration
│   ├── models/              # Database models
│   │   ├── postgres/        # Sequelize models
│   │   └── mongodb/         # Mongoose schemas
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── socket/            # Socket.IO handlers
│   ├── tests/             # Test files
│   ├── migrations/        # Database migrations
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── .env.example           # Environment variables template
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Architecture

### Layered Architecture

The application follows a layered architecture pattern:

1. **Routes Layer** (`src/routes/`) - Define API endpoints and validation
2. **Controllers Layer** (`src/controllers/`) - Handle HTTP requests/responses
3. **Services Layer** (`src/services/`) - Business logic and orchestration
4. **Repositories Layer** (`src/repositories/`) - Data access abstraction
5. **Models Layer** (`src/models/`) - Database models and schemas

### Geofencing Logic

The geofencing system uses the **Haversine formula** to calculate distances between geographic coordinates:

1. When a location update is received via `POST /api/v1/location`, the system:
   - Saves the location event to MongoDB
   - Checks the user's position against all geofences
   - Detects enter/exit events by comparing current state with previous state
   - Emits Socket.IO events for real-time notifications
   - Logs geofence events to MongoDB

2. User states (which geofences they're currently inside) are maintained in memory for fast lookups.

### Database Strategy

- **PostgreSQL**: Stores structured relational data (users, geofences)
- **MongoDB**: Stores time-series event data (location updates, geofence events) for flexible querying and analytics

## Example Usage

### Create a User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

### Create a Geofence

```bash
curl -X POST http://localhost:3000/api/v1/geofences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Office Building",
    "latitude": 40.7128,
    "longitude": -74.006,
    "radius": 100,
    "userId": 1
  }'
```

### Record Location Update

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

This will automatically trigger geofencing checks and emit Socket.IO events if the user enters or exits any geofences.

## License

ISC

## Support

For issues, questions, or contributions, please refer to the project repository.

