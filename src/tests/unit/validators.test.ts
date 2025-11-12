import {
  isValidLatitude,
  isValidLongitude,
  isValidCoordinates,
  isValidRadius,
  isValidGeofenceData,
  isValidEmail,
} from '../../utils/validators';

describe('Validators', () => {
  describe('isValidLatitude', () => {
    it('should return true for valid latitude', () => {
      expect(isValidLatitude(40.7128)).toBe(true);
      expect(isValidLatitude(-90)).toBe(true);
      expect(isValidLatitude(90)).toBe(true);
    });

    it('should return false for invalid latitude', () => {
      expect(isValidLatitude(91)).toBe(false);
      expect(isValidLatitude(-91)).toBe(false);
    });
  });

  describe('isValidLongitude', () => {
    it('should return true for valid longitude', () => {
      expect(isValidLongitude(-74.006)).toBe(true);
      expect(isValidLongitude(-180)).toBe(true);
      expect(isValidLongitude(180)).toBe(true);
    });

    it('should return false for invalid longitude', () => {
      expect(isValidLongitude(181)).toBe(false);
      expect(isValidLongitude(-181)).toBe(false);
    });
  });

  describe('isValidCoordinates', () => {
    it('should return true for valid coordinates', () => {
      expect(isValidCoordinates(40.7128, -74.006)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(isValidCoordinates(91, -74.006)).toBe(false);
      expect(isValidCoordinates(40.7128, 181)).toBe(false);
    });
  });

  describe('isValidRadius', () => {
    it('should return true for valid radius', () => {
      expect(isValidRadius(100)).toBe(true);
      expect(isValidRadius(0.1)).toBe(true);
    });

    it('should return false for invalid radius', () => {
      expect(isValidRadius(0)).toBe(false);
      expect(isValidRadius(-10)).toBe(false);
    });
  });

  describe('isValidGeofenceData', () => {
    it('should return true for valid geofence data', () => {
      expect(isValidGeofenceData('Test Geofence', 40.7128, -74.006, 100)).toBe(true);
    });

    it('should return false for invalid geofence data', () => {
      expect(isValidGeofenceData('', 40.7128, -74.006, 100)).toBe(false);
      expect(isValidGeofenceData('Test', 91, -74.006, 100)).toBe(false);
      expect(isValidGeofenceData('Test', 40.7128, -74.006, 0)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });
});

