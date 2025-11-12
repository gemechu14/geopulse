import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../types';
import { isValidEmail } from '../utils/validators';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Create a new user with hashed password
   */
  async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    if (!isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password || '', 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<IUser[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: Partial<IUser>): Promise<IUser> {
    if (userData.email && !isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const [affectedRows, updatedUsers] = await this.userRepository.update(id, userData);
    if (affectedRows === 0 || !updatedUsers[0]) {
      throw new Error('User not found');
    }

    const user = updatedUsers[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    const deletedCount = await this.userRepository.delete(id);
    if (deletedCount === 0) {
      throw new Error('User not found');
    }
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

