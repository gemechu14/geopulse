import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GeoPulse API',
    version: '1.0.0',
    description: 'Production-ready backend API for GeoPulse - Location tracking and geofencing system',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: `http://${process.env.SWAGGER_HOST || 'localhost:3000'}`,
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Location',
      description: 'Location tracking endpoints',
    },
    {
      name: 'Geofences',
      description: 'Geofence management endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

