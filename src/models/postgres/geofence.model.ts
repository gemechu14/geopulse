import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { IGeofence } from '../../types';
import User from './user.model';

interface GeofenceCreationAttributes
  extends Optional<IGeofence, 'id' | 'createdAt' | 'updatedAt'> {}

class Geofence extends Model<IGeofence, GeofenceCreationAttributes> implements IGeofence {
  public id!: number;
  public name!: string;
  public latitude!: number;
  public longitude!: number;
  public radius!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Geofence.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    radius: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
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
    tableName: 'geofences',
    timestamps: true,
  }
);

Geofence.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Geofence, { foreignKey: 'userId', as: 'geofences' });

export default Geofence;

