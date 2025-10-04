import mongoose from 'mongoose';

// Delete existing model to avoid caching issues
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [50, 'Name cannot be more than 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [20, 'Username cannot be more than 20 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
    },
    preferences: {
      skillGoals: {
        type: [String],
        default: [],
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
      difficultyPreference: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
      },
      availableTime: {
        type: Number, // in minutes
        default: 30,
        min: [5, 'Minimum time should be 5 minutes'],
        max: [300, 'Maximum time should be 300 minutes'],
      },
    },
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastActivityDate: {
        type: Date,
        default: null,
      },
    },
    badges: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);