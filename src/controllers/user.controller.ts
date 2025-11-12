import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CustomError } from '../middleware/error.middleware';

const userService = new UserService();

export class UserController {
  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   */
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const user = await userService.getUserById(id);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   */
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const user = await userService.updateUser(id, req.body);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Delete user
   *     tags: [Users]
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new CustomError('Invalid user ID', 400);
      }

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

