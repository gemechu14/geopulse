import LocationEvent from '../models/mongodb/location-event.model';
import { ILocationEvent, ILocationUpdate } from '../types';
import { isValidCoordinates } from '../utils/validators';
import { GeofencingService } from './geofencing.service';

export class LocationService {
  private geofencingService: GeofencingService;

  constructor() {
    this.geofencingService = new GeofencingService();
  }

  /**
   * Record a location update and trigger geofencing checks
   */
  async recordLocationUpdate(locationData: ILocationUpdate): Promise<ILocationEvent> {
    if (!isValidCoordinates(locationData.latitude, locationData.longitude)) {
      throw new Error('Invalid coordinates');
    }

    const locationEvent: ILocationEvent = {
      userId: locationData.userId,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timestamp: new Date(),
      accuracy: locationData.accuracy,
    };

    // Save location event to MongoDB
    const savedEvent = await LocationEvent.create(locationEvent);

    // Trigger geofencing checks
    await this.geofencingService.checkGeofences(
      locationData.userId,
      locationData.latitude,
      locationData.longitude
    );

    return {
      userId: savedEvent.userId,
      latitude: savedEvent.latitude,
      longitude: savedEvent.longitude,
      timestamp: savedEvent.timestamp,
      accuracy: savedEvent.accuracy,
    };
  }

  /**
   * Get location history for a user
   */
  async getLocationHistory(userId: number, limit: number = 100): Promise<ILocationEvent[]> {
    const events = await LocationEvent.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();

    return events.map((event) => ({
      userId: event.userId,
      latitude: event.latitude,
      longitude: event.longitude,
      timestamp: event.timestamp,
      accuracy: event.accuracy,
    }));
  }

  /**
   * Get latest location for a user
   */
  async getLatestLocation(userId: number): Promise<ILocationEvent | null> {
    const event = await LocationEvent.findOne({ userId })
      .sort({ timestamp: -1 })
      .exec();

    if (!event) {
      return null;
    }

    return {
      userId: event.userId,
      latitude: event.latitude,
      longitude: event.longitude,
      timestamp: event.timestamp,
      accuracy: event.accuracy,
    };
  }
}

