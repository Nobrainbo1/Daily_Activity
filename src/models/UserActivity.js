import mongoose from 'mongoose';

// Delete existing model to avoid caching issues
if (mongoose.models.UserActivity) {
  delete mongoose.models.UserActivity;
}

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
      enum: ['added', 'pending', 'in-progress', 'completed', 'skipped', 'saved', 'deleted'],
      default: 'added',
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Progress tracking for step-by-step activities
    progress: {
      currentStep: {
        type: Number,
        default: 0
      },
      completedSteps: [{
        stepNumber: Number,
        completedAt: Date
      }],
      totalSteps: {
        type: Number,
        default: 0
      },
      percentComplete: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      startedAt: {
        type: Date,
        default: null
      }
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