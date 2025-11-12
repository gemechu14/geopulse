import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/location.service';
import { CustomError } from '../middleware/error.middleware';

const locationService = new LocationService();

export class LocationController {
  /**
   * @swagger
   * /api/v1/location:
   *   post:
   *     summary: Record location update
   *     tags: [Location]
   */
  static async recordLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locationEvent = await locationService.recordLocationUpdate(req.body);
      res.status(201).json({
        status: 'success',
        data: locationEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/location/{userId}/history:
   *   get:
   *     summary: Get location history for a user
   *     tags: [Location]
   */
  static async getLocationHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const history = await locationService.getLocationHistory(userId, limit);
      res.status(200).json({
        status: 'success',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/location/{userId}/latest:
   *   get:
   *     summary: Get latest location for a user
   *     tags: [Location]
   */
  static async getLatestLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const location = await locationService.getLatestLocation(userId);
      if (!location) {
        res.status(404).json({
          status: 'error',
          message: 'No location found for this user',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: location,
      });
    } catch (error) {
      next(error);
    }
  }
}

