import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);