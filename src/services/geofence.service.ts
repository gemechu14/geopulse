import { GeofenceRepository } from '../repositories/geofence.repository';
import { IGeofence, IGeofenceCreate, IGeofenceUpdate } from '../types';
import { isValidGeofenceData } from '../utils/validators';

export class GeofenceService {
  private geofenceRepository: GeofenceRepository;

  constructor() {
    this.geofenceRepository = new GeofenceRepository();
  }

  /**
   * Create a new geofence
   */
  async createGeofence(geofenceData: IGeofenceCreate): Promise<IGeofence> {
    if (!isValidGeofenceData(geofenceData.name, geofenceData.latitude, geofenceData.longitude, geofenceData.radius)) {
      throw new Error('Invalid geofence data');
    }

    const geofence = await this.geofenceRepository.create(geofenceData);
    return {
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    };
  }

  /**
   * Get geofence by ID
   */
  async getGeofenceById(id: number): Promise<IGeofence> {
    const geofence = await this.geofenceRepository.findById(id);
    if (!geofence) {
      throw new Error('Geofence not found');
    }

    return {
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    };
  }

  /**
   * Get all geofences for a user
   */
  async getGeofencesByUserId(userId: number): Promise<IGeofence[]> {
    const geofences = await this.geofenceRepository.findByUserId(userId);
    return geofences.map((geofence) => ({
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    }));
  }

  /**
   * Get all geofences
   */
  async getAllGeofences(): Promise<IGeofence[]> {
    const geofences = await this.geofenceRepository.findAll();
    return geofences.map((geofence) => ({
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    }));
  }

  /**
   * Update geofence
   */
  async updateGeofence(id: number, geofenceData: IGeofenceUpdate): Promise<IGeofence> {
    if (
      geofenceData.latitude !== undefined &&
      geofenceData.longitude !== undefined &&
      geofenceData.radius !== undefined &&
      !isValidGeofenceData(
        geofenceData.name || '',
        geofenceData.latitude,
        geofenceData.longitude,
        geofenceData.radius
      )
    ) {
      throw new Error('Invalid geofence data');
    }

    const [affectedRows, updatedGeofences] = await this.geofenceRepository.update(
      id,
      geofenceData
    );
    if (affectedRows === 0 || !updatedGeofences[0]) {
      throw new Error('Geofence not found');
    }

    const geofence = updatedGeofences[0];
    return {
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    };
  }

  /**
   * Delete geofence
   */
  async deleteGeofence(id: number): Promise<void> {
    const deletedCount = await this.geofenceRepository.delete(id);
    if (deletedCount === 0) {
      throw new Error('Geofence not found');
    }
  }

  /**
   * Get geofences near a location
   */
  async getNearbyGeofences(
    latitude: number,
    longitude: number,
    maxDistance: number = 10000
  ): Promise<IGeofence[]> {
    const geofences = await this.geofenceRepository.findNearby(latitude, longitude, maxDistance);
    return geofences.map((geofence) => ({
      id: geofence.id,
      name: geofence.name,
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
      userId: geofence.userId,
      createdAt: geofence.createdAt,
      updatedAt: geofence.updatedAt,
    }));
  }
}

