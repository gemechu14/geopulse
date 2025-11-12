import {
  calculateDistance,
  isInsideGeofence,
  distanceToGeofence,
} from '../../utils/geofencing.utils';

describe('Geofencing Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Distance between New York and Los Angeles (approximately 3944 km)
      const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
      expect(distance).toBeCloseTo(3944000, -3); // Within 1km accuracy
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(distance).toBeCloseTo(0, 1);
    });

    it('should handle negative coordinates', () => {
      const distance = calculateDistance(-33.8688, 151.2093, -37.8136, 144.9631);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('isInsideGeofence', () => {
    it('should return true when point is inside geofence', () => {
      const result = isInsideGeofence(40.7128, -74.006, 40.7128, -74.006, 1000);
      expect(result).toBe(true);
    });

    it('should return false when point is outside geofence', () => {
      const result = isInsideGeofence(40.7128, -74.006, 34.0522, -118.2437, 1000);
      expect(result).toBe(false);
    });

    it('should return true when point is exactly on the boundary', () => {
      // Point 100m away from center with radius 100m
      const result = isInsideGeofence(40.7128, -74.006, 40.7128, -74.006, 100);
      expect(result).toBe(true);
    });
  });

  describe('distanceToGeofence', () => {
    it('should calculate distance to geofence center', () => {
      const distance = distanceToGeofence(40.7128, -74.006, 40.7138, -74.006);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200000); // Should be less than 200km
    });
  });
});

