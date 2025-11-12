import { Request, Response, NextFunction } from 'express';
import { GeofenceService } from '../services/geofence.service';
import { CustomError } from '../middleware/error.middleware';

const geofenceService = new GeofenceService();

export class GeofenceController {
  /**
   * @swagger
   * /api/v1/geofences:
   *   get:
   *     summary: Get all geofences
   *     tags: [Geofences]
   */
  static async getAllGeofences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const geofences = await geofenceService.getAllGeofences();
      res.status(200).json({
        status: 'success',
        data: geofences,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/geofences/{id}:
   *   get:
   *     summary: Get geofence by ID
   *     tags: [Geofences]
   */
  static async getGeofenceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid geofence ID', 400);
      }

      const geofence = await geofenceService.getGeofenceById(id);
      res.status(200).json({
        status: 'success',
        data: geofence,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/geofences:
   *   post:
   *     summary: Create a new geofence
   *     tags: [Geofences]
   */
  static async createGeofence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const geofence = await geofenceService.createGeofence(req.body);
      res.status(201).json({
        status: 'success',
        data: geofence,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/geofences/{id}:
   *   put:
   *     summary: Update geofence
   *     tags: [Geofences]
   */
  static async updateGeofence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid geofence ID', 400);
      }

      const geofence = await geofenceService.updateGeofence(id, req.body);
      res.status(200).json({
        status: 'success',
        data: geofence,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/geofences/{id}:
   *   delete:
   *     summary: Delete geofence
   *     tags: [Geofences]
   */
  static async deleteGeofence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid geofence ID', 400);
      }

      await geofenceService.deleteGeofence(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/geofences/user/{userId}:
   *   get:
   *     summary: Get all geofences for a user
   *     tags: [Geofences]
   */
  static async getGeofencesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const geofences = await geofenceService.getGeofencesByUserId(userId);
      res.status(200).json({
        status: 'success',
        data: geofences,
      });
    } catch (error) {
      next(error);
    }
  }
}

