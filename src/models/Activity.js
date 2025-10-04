import mongoose from 'mongoose';

// Delete existing model to avoid caching issues
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxLength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
      maxLength: [500, 'Description cannot be more than 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Creativity',
        'Mindfulness',
        'Productivity',
        'Communication',
        'Fitness',
        'Learning',
        'Social',
        'Self-Care',
      ],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    estimatedTime: {
      type: Number, // in minutes
      required: [true, 'Estimated time is required'],
      min: [5, 'Minimum time should be 5 minutes'],
      max: [300, 'Maximum time should be 300 minutes'],
    },
    tags: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    // New step-by-step structure with tips and videos
    steps: [{
      stepNumber: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      tips: [{
        type: String,
        trim: true
      }],
      videoUrl: {
        type: String,
        trim: true,
        default: null
      },
      estimatedDuration: {
        type: Number, // in minutes
        default: 5
      }
    }],
    materials: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
ActivitySchema.index({ category: 1, difficulty: 1, estimatedTime: 1 });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);