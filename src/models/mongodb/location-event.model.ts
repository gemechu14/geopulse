import mongoose, { Schema, Document } from 'mongoose';
import { ILocationEvent } from '../../types';

export interface ILocationEventDocument extends ILocationEvent, Document {}

const LocationEventSchema = new Schema<ILocationEventDocument>(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    accuracy: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for efficient queries
LocationEventSchema.index({ userId: 1, timestamp: -1 });

const LocationEvent = mongoose.model<ILocationEventDocument>(
  'LocationEvent',
  LocationEventSchema
);

export default LocationEvent;

