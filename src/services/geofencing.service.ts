import { Server as SocketIOServer } from 'socket.io';
import { GeofenceRepository } from '../repositories/geofence.repository';
import GeofenceEvent from '../models/mongodb/geofence-event.model';
import { isInsideGeofence } from '../utils/geofencing.utils';
import { IGeofenceEvent, IUserState } from '../types';

// In-memory store for user states (which geofences they're currently inside)
// In production, consider using Redis for distributed systems
const userStates = new Map<number, IUserState>();

// Shared Socket.IO instance across all GeofencingService instances
let socketIOInstance: SocketIOServer | undefined;

export class GeofencingService {
  private geofenceRepository: GeofenceRepository;

  constructor() {
    this.geofenceRepository = new GeofenceRepository();
  }

  /**
   * Set Socket.IO server instance for emitting events
   * This is shared across all instances of GeofencingService
   */
  static setSocketIO(io: SocketIOServer): void {
    socketIOInstance = io;
  }

  /**
   * Initialize user state
   */
  private initializeUserState(userId: number): IUserState {
    if (!userStates.has(userId)) {
      userStates.set(userId, {
        userId,
        currentGeofences: new Set(),
      });
    }
    return userStates.get(userId)!;
  }

  /**
   * Check user location against all geofences and trigger events
   */
  async checkGeofences(userId: number, latitude: number, longitude: number): Promise<void> {
    const userState = this.initializeUserState(userId);

    // Update last known location
    userState.lastLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
    };

    // Get all geofences (or nearby ones for optimization)
    const geofences = await this.geofenceRepository.findAll();

    // Check each geofence
    for (const geofence of geofences) {
      const geofenceLat = Number(geofence.latitude);
      const geofenceLon = Number(geofence.longitude);
      const radius = Number(geofence.radius);
      const geofenceId = geofence.id!;

      const isInside = isInsideGeofence(latitude, longitude, geofenceLat, geofenceLon, radius);
      const wasInside = userState.currentGeofences.has(geofenceId);

      if (isInside && !wasInside) {
        // User entered geofence
        await this.handleGeofenceEnter(userId, geofenceId, latitude, longitude);
        userState.currentGeofences.add(geofenceId);
      } else if (!isInside && wasInside) {
        // User exited geofence
        await this.handleGeofenceExit(userId, geofenceId, latitude, longitude);
        userState.currentGeofences.delete(geofenceId);
      }
    }
  }

  /**
   * Handle geofence enter event
   */
  private async handleGeofenceEnter(
    userId: number,
    geofenceId: number,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const event: IGeofenceEvent = {
      userId,
      geofenceId,
      eventType: 'enter',
      timestamp: new Date(),
      location: {
        latitude,
        longitude,
      },
    };

    // Save event to MongoDB
    await GeofenceEvent.create(event);

    // Emit Socket.IO event
    if (socketIOInstance) {
      socketIOInstance.emit('geofence:enter', {
        userId,
        geofenceId,
        location: {
          latitude,
          longitude,
        },
        timestamp: event.timestamp,
      });

      // Also emit to user-specific room
      socketIOInstance.to(`user:${userId}`).emit('geofence:enter', {
        userId,
        geofenceId,
        location: {
          latitude,
          longitude,
        },
        timestamp: event.timestamp,
      });
    }
  }

  /**
   * Handle geofence exit event
   */
  private async handleGeofenceExit(
    userId: number,
    geofenceId: number,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const event: IGeofenceEvent = {
      userId,
      geofenceId,
      eventType: 'exit',
      timestamp: new Date(),
      location: {
        latitude,
        longitude,
      },
    };

    // Save event to MongoDB
    await GeofenceEvent.create(event);

    // Emit Socket.IO event
    if (socketIOInstance) {
      socketIOInstance.emit('geofence:exit', {
        userId,
        geofenceId,
        location: {
          latitude,
          longitude,
        },
        timestamp: event.timestamp,
      });

      // Also emit to user-specific room
      socketIOInstance.to(`user:${userId}`).emit('geofence:exit', {
        userId,
        geofenceId,
        location: {
          latitude,
          longitude,
        },
        timestamp: event.timestamp,
      });
    }
  }

  /**
   * Get geofence events for a user
   */
  async getGeofenceEvents(userId: number, limit: number = 100): Promise<IGeofenceEvent[]> {
    const events = await GeofenceEvent.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();

    return events.map((event) => ({
      userId: event.userId,
      geofenceId: event.geofenceId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      location: event.location,
    }));
  }

  /**
   * Get geofence events for a specific geofence
   */
  async getGeofenceEventsByGeofence(
    geofenceId: number,
    limit: number = 100
  ): Promise<IGeofenceEvent[]> {
    const events = await GeofenceEvent.find({ geofenceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();

    return events.map((event) => ({
      userId: event.userId,
      geofenceId: event.geofenceId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      location: event.location,
    }));
  }
}

