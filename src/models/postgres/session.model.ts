import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { ISession } from '../../types';
import User from './user.model';

interface SessionCreationAttributes extends Optional<ISession, 'id' | 'createdAt' | 'updatedAt'> {}

class Session extends Model<ISession, SessionCreationAttributes> implements ISession {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
  }
);

Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });

export default Session;

