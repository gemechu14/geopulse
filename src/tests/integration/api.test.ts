import request from 'supertest';
import app from '../../app';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('User API', () => {
    let userId: number;

    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app).post('/api/v1/users').send(userData);
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe(userData.email);
      userId = response.body.data.id;
    });

    it('should get user by ID', async () => {
      const response = await request(app).get(`/api/v1/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(userId);
    });

    it('should update user', async () => {
      const updateData = {
        name: 'Updated User',
      };

      const response = await request(app).put(`/api/v1/users/${userId}`).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should delete user', async () => {
      const response = await request(app).delete(`/api/v1/users/${userId}`);
      expect(response.status).toBe(204);
    });
  });

  describe('Geofence API', () => {
    let geofenceId: number;
    let userId: number;

    beforeAll(async () => {
      // Create a user first
      const userResponse = await request(app).post('/api/v1/users').send({
        email: 'geofence-test@example.com',
        name: 'Geofence Test User',
        password: 'password123',
      });
      userId = userResponse.body.data.id;
    });

    it('should create a new geofence', async () => {
      const geofenceData = {
        name: 'Test Geofence',
        latitude: 40.7128,
        longitude: -74.006,
        radius: 100,
        userId: userId,
      };

      const response = await request(app).post('/api/v1/geofences').send(geofenceData);
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(geofenceData.name);
      geofenceId = response.body.data.id;
    });

    it('should get geofence by ID', async () => {
      const response = await request(app).get(`/api/v1/geofences/${geofenceId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(geofenceId);
    });

    it('should get geofences by user ID', async () => {
      const response = await request(app).get(`/api/v1/geofences/user/${userId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should delete geofence', async () => {
      const response = await request(app).delete(`/api/v1/geofences/${geofenceId}`);
      expect(response.status).toBe(204);
    });

    afterAll(async () => {
      // Cleanup: delete test user
      await request(app).delete(`/api/v1/users/${userId}`);
    });
  });

  describe('Location API', () => {
    let userId: number;

    beforeAll(async () => {
      // Create a user first
      const userResponse = await request(app).post('/api/v1/users').send({
        email: 'location-test@example.com',
        name: 'Location Test User',
        password: 'password123',
      });
      userId = userResponse.body.data.id;
    });

    it('should record location update', async () => {
      const locationData = {
        userId: userId,
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
      };

      const response = await request(app).post('/api/v1/location').send(locationData);
      expect(response.status).toBe(201);
      expect(response.body.data.userId).toBe(userId);
    });

    it('should get location history', async () => {
      const response = await request(app).get(`/api/v1/location/${userId}/history`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get latest location', async () => {
      const response = await request(app).get(`/api/v1/location/${userId}/latest`);
      expect(response.status).toBe(200);
      expect(response.body.data.userId).toBe(userId);
    });

    afterAll(async () => {
      // Cleanup: delete test user
      await request(app).delete(`/api/v1/users/${userId}`);
    });
  });
});

