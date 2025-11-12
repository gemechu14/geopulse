import User from '../models/postgres/user.model';
import { IUser } from '../types';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await User.create(userData);
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  /**
   * Update user
   */
  async update(id: number, userData: Partial<IUser>): Promise<[number, User[]]> {
    return await User.update(userData, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<number> {
    return await User.destroy({ where: { id } });
  }
}

