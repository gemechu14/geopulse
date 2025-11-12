import { Router } from 'express';
import { body, param } from 'express-validator';
import { GeofenceController } from '../controllers/geofence.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Geofence:
 *       type: object
 *       required:
 *         - name
 *         - latitude
 *         - longitude
 *         - radius
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         radius:
 *           type: number
 *           minimum: 0
 *           description: Radius in meters
 *         userId:
 *           type: integer
 */

router.get(
  '/',
  GeofenceController.getAllGeofences
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('Geofence ID must be an integer')],
  validate([param('id')]),
  GeofenceController.getGeofenceById
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('radius').isFloat({ min: 0 }).withMessage('Radius must be a positive number'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validate([
    body('name'),
    body('latitude'),
    body('longitude'),
    body('radius'),
    body('userId'),
  ]),
  GeofenceController.createGeofence
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Geofence ID must be an integer'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('radius').optional().isFloat({ min: 0 }).withMessage('Radius must be a positive number'),
  ],
  validate([
    param('id'),
    body('name'),
    body('latitude'),
    body('longitude'),
    body('radius'),
  ]),
  GeofenceController.updateGeofence
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('Geofence ID must be an integer')],
  validate([param('id')]),
  GeofenceController.deleteGeofence
);

router.get(
  '/user/:userId',
  [param('userId').isInt().withMessage('User ID must be an integer')],
  validate([param('userId')]),
  GeofenceController.getGeofencesByUserId
);

export default router;

