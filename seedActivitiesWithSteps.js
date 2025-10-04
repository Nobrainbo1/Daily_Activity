const mongoose = require('mongoose');
const { mockActivitiesWithSteps } = require('./src/data/activitiesWithSteps');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daily_activity';

// Define Activity Schema (same as model)
const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    category: {
      type: String,
      required: true,
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
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 5,
      max: 300,
    },
    tags: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
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
        type: Number,
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

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

async function seedActivitiesWithSteps() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing activities
    console.log('Clearing existing activities...');
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Insert new activities with steps
    console.log('Inserting activities with steps...');
    const insertedActivities = await Activity.insertMany(mockActivitiesWithSteps);
    console.log(`✓ Successfully inserted ${insertedActivities.length} activities with step-by-step instructions!`);

    // Display summary
    console.log('\n📊 Summary:');
    for (const activity of insertedActivities) {
      console.log(`  - ${activity.title} (${activity.category}) - ${activity.steps?.length || 0} steps`);
    }

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedActivitiesWithSteps();
