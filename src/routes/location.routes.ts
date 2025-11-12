import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { LocationController } from '../controllers/location.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LocationUpdate:
 *       type: object
 *       required:
 *         - userId
 *         - latitude
 *         - longitude
 *       properties:
 *         userId:
 *           type: integer
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         accuracy:
 *           type: number
 */

router.post(
  '/',
  [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('accuracy').optional().isFloat({ min: 0 }).withMessage('Accuracy must be a positive number'),
  ],
  validate([
    body('userId'),
    body('latitude'),
    body('longitude'),
    body('accuracy'),
  ]),
  LocationController.recordLocation
);

router.get(
  '/:userId/history',
  [
    param('userId').isInt().withMessage('User ID must be an integer'),
    query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  ],
  validate([param('userId'), query('limit')]),
  LocationController.getLocationHistory
);

router.get(
  '/:userId/latest',
  [param('userId').isInt().withMessage('User ID must be an integer')],
  validate([param('userId')]),
  LocationController.getLatestLocation
);

export default router;

