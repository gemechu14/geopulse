import mongoose, { Schema, Document } from 'mongoose';
import { IGeofenceEvent } from '../../types';

export interface IGeofenceEventDocument extends IGeofenceEvent, Document {}

const GeofenceEventSchema = new Schema<IGeofenceEventDocument>(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    geofenceId: {
      type: Number,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['enter', 'exit'],
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for efficient queries
GeofenceEventSchema.index({ userId: 1, timestamp: -1 });
GeofenceEventSchema.index({ geofenceId: 1, timestamp: -1 });
GeofenceEventSchema.index({ userId: 1, geofenceId: 1, timestamp: -1 });

const GeofenceEvent = mongoose.model<IGeofenceEventDocument>(
  'GeofenceEvent',
  GeofenceEventSchema
);

export default GeofenceEvent;

