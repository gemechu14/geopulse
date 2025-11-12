/**
 * Validate latitude value
 * @param lat Latitude value
 * @returns true if valid
 */
export function isValidLatitude(lat: number): boolean {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value
 * @param lon Longitude value
 * @returns true if valid
 */
export function isValidLongitude(lon: number): boolean {
  return typeof lon === 'number' && lon >= -180 && lon <= 180;
}

/**
 * Validate coordinates (latitude and longitude)
 * @param lat Latitude value
 * @param lon Longitude value
 * @returns true if both are valid
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lon);
}

/**
 * Validate geofence radius
 * @param radius Radius in meters
 * @returns true if valid
 */
export function isValidRadius(radius: number): boolean {
  return typeof radius === 'number' && radius > 0;
}

/**
 * Validate geofence data
 * @param name Geofence name
 * @param lat Latitude
 * @param lon Longitude
 * @param radius Radius in meters
 * @returns true if all fields are valid
 */
export function isValidGeofenceData(
  name: string,
  lat: number,
  lon: number,
  radius: number
): boolean {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    isValidCoordinates(lat, lon) &&
    isValidRadius(radius)
  );
}

/**
 * Validate email format
 * @param email Email string
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

