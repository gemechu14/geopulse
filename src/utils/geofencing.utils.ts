/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a point is inside a geofence (circle)
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param geofenceLat Geofence center latitude
 * @param geofenceLon Geofence center longitude
 * @param radius Geofence radius in meters
 * @returns true if user is inside the geofence
 */
export function isInsideGeofence(
  userLat: number,
  userLon: number,
  geofenceLat: number,
  geofenceLon: number,
  radius: number
): boolean {
  const distance = calculateDistance(userLat, userLon, geofenceLat, geofenceLon);
  return distance <= radius;
}

/**
 * Calculate the distance from a point to a geofence center
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param geofenceLat Geofence center latitude
 * @param geofenceLon Geofence center longitude
 * @returns Distance in meters
 */
export function distanceToGeofence(
  userLat: number,
  userLon: number,
  geofenceLat: number,
  geofenceLon: number
): number {
  return calculateDistance(userLat, userLon, geofenceLat, geofenceLon);
}

