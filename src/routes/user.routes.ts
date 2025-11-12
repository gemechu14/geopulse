import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 */

router.get(
  '/',
  UserController.getAllUsers
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('User ID must be an integer')],
  validate([param('id')]),
  UserController.getUserById
);

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate([
    body('email'),
    body('name'),
    body('password'),
  ]),
  UserController.createUser
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate([
    param('id'),
    body('email'),
    body('name'),
    body('password'),
  ]),
  UserController.updateUser
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('User ID must be an integer')],
  validate([param('id')]),
  UserController.deleteUser
);

export default router;

