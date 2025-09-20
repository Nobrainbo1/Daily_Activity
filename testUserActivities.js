const mongoose = require('mongoose');

// Connect to MongoDB
const uri = 'mongodb+srv://company-app:company-app123@cluster0.4e12bpv.mongodb.net/daily_activity';

async function testUserActivities() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Define models
    const UserActivity = mongoose.model('UserActivity', {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
      status: { type: String, enum: ['added', 'pending', 'completed', 'skipped', 'saved', 'deleted'], default: 'added' },
      scheduledTime: { type: String, default: null },
      notes: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    });

    const User = mongoose.model('User', {
      name: String,
      username: String,
      password: String
    });

    const Activity = mongoose.model('Activity', {
      title: String,
      description: String,
      category: String,
      difficulty: String,
      estimatedTime: Number,
      instructions: [String]
    });

    // Get sample data
    const users = await User.find({}).limit(1);
    const activities = await Activity.find({}).limit(1);

    console.log('📊 Database Status:');
    console.log('Users:', users.length);
    console.log('Activities:', activities.length);

    if (users.length > 0 && activities.length > 0) {
      const sampleUser = users[0];
      const sampleActivity = activities[0];

      console.log('👤 Sample User:', sampleUser.name, sampleUser._id);
      console.log('🏃 Sample Activity:', sampleActivity.title, sampleActivity._id);

      // Check existing user activities
      const existingUserActivities = await UserActivity.find({});
      console.log('📝 Existing UserActivities:', existingUserActivities.length);

      // Try to create a test user activity
      const testUserActivity = new UserActivity({
        userId: sampleUser._id,
        activityId: sampleActivity._id,
        status: 'added'
      });

      await testUserActivity.save();
      console.log('✅ Test UserActivity created:', testUserActivity._id);

      // Try to populate it
      const populated = await UserActivity.findById(testUserActivity._id).populate('activityId');
      console.log('✅ Populated UserActivity:', populated.activityId.title);

      // Clean up test data
      await UserActivity.findByIdAndDelete(testUserActivity._id);
      console.log('🧹 Cleaned up test data');
    } else {
      console.log('❌ No users or activities found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

testUserActivities();