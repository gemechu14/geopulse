import { Op } from 'sequelize';
import Geofence from '../models/postgres/geofence.model';
import { IGeofence } from '../types';

export class GeofenceRepository {
  /**
   * Create a new geofence
   */
  async create(
    geofenceData: Omit<IGeofence, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Geofence> {
    return await Geofence.create(geofenceData);
  }

  /**
   * Find geofence by ID
   */
  async findById(id: number): Promise<Geofence | null> {
    return await Geofence.findByPk(id);
  }

  /**
   * Find all geofences for a user
   */
  async findByUserId(userId: number): Promise<Geofence[]> {
    return await Geofence.findAll({ where: { userId } });
  }

  /**
   * Find all geofences
   */
  async findAll(): Promise<Geofence[]> {
    return await Geofence.findAll();
  }

  /**
   * Update geofence
   */
  async update(id: number, geofenceData: Partial<IGeofence>): Promise<[number, Geofence[]]> {
    return await Geofence.update(geofenceData, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Delete geofence
   */
  async delete(id: number): Promise<number> {
    return await Geofence.destroy({ where: { id } });
  }

  /**
   * Find geofences near a location (within a bounding box for efficiency)
   * This is a simple implementation - for production, consider using PostGIS
   */
  async findNearby(
    latitude: number,
    longitude: number,
    maxDistance: number = 10000
  ): Promise<Geofence[]> {
    // Simple bounding box approximation (1 degree ≈ 111km)
    const latDelta = maxDistance / 111000;
    const lonDelta = maxDistance / (111000 * Math.cos((latitude * Math.PI) / 180));

    return await Geofence.findAll({
      where: {
        latitude: {
          [Op.gte]: latitude - latDelta,
          [Op.lte]: latitude + latDelta,
        },
        longitude: {
          [Op.gte]: longitude - lonDelta,
          [Op.lte]: longitude + lonDelta,
        },
      },
    });
  }
}

