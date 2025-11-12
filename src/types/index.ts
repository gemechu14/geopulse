export interface IUser {
  id?: number;
  email: string;
  name: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISession {
  id?: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGeofence {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocationEvent {
  userId: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export interface IGeofenceEvent {
  userId: number;
  geofenceId: number;
  eventType: 'enter' | 'exit';
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ILocationUpdate {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface IGeofenceCreate {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  userId: number;
}

export interface IGeofenceUpdate {
  name?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface IUserState {
  userId: number;
  currentGeofences: Set<number>; // Set of geofence IDs user is currently inside
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
}

