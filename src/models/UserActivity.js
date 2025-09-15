import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: [true, 'Activity ID is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'completed', 'skipped', 'favorited'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number, // in minutes
      default: null,
      min: [0, 'Time spent cannot be negative'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      maxLength: [200, 'Feedback cannot be more than 200 characters'],
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, 'Notes cannot be more than 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one record per user-activity combination per day
UserActivitySchema.index({ 
  userId: 1, 
  activityId: 1, 
  createdAt: 1 
});

// Index for querying user activities by status
UserActivitySchema.index({ userId: 1, status: 1 });

export default mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema);