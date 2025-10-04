/**
 * Quick Test Script for Bug Fixes
 * 
 * This script helps verify that:
 * 1. Activities exist in database
 * 2. User activities can be fetched
 * 3. UserActivity populate works correctly
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Activity = require('./src/models/Activity');
const UserActivity = require('./src/models/UserActivity');
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function testBugFixes() {
  try {
    console.log('\n🔍 Testing Bug Fixes...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check activities exist
    console.log('📋 Test 1: Checking activities in database...');
    const activities = await Activity.find({});
    console.log(`✅ Found ${activities.length} activities`);
    if (activities.length > 0) {
      console.log(`   Sample activity: "${activities[0].title}" (ID: ${activities[0]._id})`);
    }
    console.log('');

    // Test 2: Check users exist
    console.log('👤 Test 2: Checking users in database...');
    const users = await User.find({});
    console.log(`✅ Found ${users.length} users`);
    if (users.length > 0) {
      console.log(`   Sample user: ${users[0].name} (ID: ${users[0]._id})`);
    }
    console.log('');

    // Test 3: Check user activities
    console.log('📊 Test 3: Checking user activities...');
    const userActivities = await UserActivity.find({});
    console.log(`✅ Found ${userActivities.length} user activities`);
    
    if (userActivities.length > 0) {
      console.log(`   Sample userActivity ID: ${userActivities[0]._id}`);
      console.log(`   User ID: ${userActivities[0].userId}`);
      console.log(`   Activity ID (ref): ${userActivities[0].activityId}`);
      console.log(`   Status: ${userActivities[0].status}`);
    }
    console.log('');

    // Test 4: Test populate on userActivity
    console.log('🔗 Test 4: Testing populate() on userActivity...');
    if (userActivities.length > 0) {
      const populatedUserActivity = await UserActivity.findById(userActivities[0]._id)
        .populate('activityId');
      
      console.log(`✅ Populated userActivity successfully`);
      console.log(`   UserActivity ID: ${populatedUserActivity._id}`);
      console.log(`   Activity Title: ${populatedUserActivity.activityId?.title || 'NOT POPULATED'}`);
      console.log(`   Activity Category: ${populatedUserActivity.activityId?.category || 'NOT POPULATED'}`);
      console.log(`   Progress: ${JSON.stringify(populatedUserActivity.progress || {})}`);
      
      if (!populatedUserActivity.activityId?.title) {
        console.log('   ⚠️  WARNING: activityId is not populated correctly!');
        console.log('   This means the activity might be deleted or the reference is broken.');
      }
    } else {
      console.log('⚠️  No user activities found to test populate');
      console.log('   Please add an activity from the web app first!');
    }
    console.log('');

    // Test 5: Verify data structure for API
    console.log('🌐 Test 5: Testing API data structure...');
    if (users.length > 0) {
      const userId = users[0]._id;
      const userActivitiesForUser = await UserActivity.find({ userId })
        .populate('activityId')
        .sort({ createdAt: -1 });
      
      console.log(`✅ Found ${userActivitiesForUser.length} activities for user ${users[0].name}`);
      
      if (userActivitiesForUser.length > 0) {
        const sample = userActivitiesForUser[0];
        console.log('\n   Sample data structure:');
        console.log(`   {`);
        console.log(`     _id: "${sample._id}",`);
        console.log(`     userId: "${sample.userId}",`);
        console.log(`     activityId: {`);
        console.log(`       _id: "${sample.activityId?._id}",`);
        console.log(`       title: "${sample.activityId?.title}",`);
        console.log(`       category: "${sample.activityId?.category}"`);
        console.log(`     },`);
        console.log(`     status: "${sample.status}",`);
        console.log(`     progress: ${JSON.stringify(sample.progress || {})}`);
        console.log(`   }`);
      }
    }
    console.log('');

    // Summary
    console.log('📝 Summary:');
    console.log(`   Activities in DB: ${activities.length}`);
    console.log(`   Users in DB: ${users.length}`);
    console.log(`   User Activities: ${userActivities.length}`);
    
    if (userActivities.length > 0) {
      const populated = await UserActivity.findById(userActivities[0]._id).populate('activityId');
      const isPopulated = !!populated.activityId?.title;
      console.log(`   Populate working: ${isPopulated ? '✅ YES' : '❌ NO'}`);
    }
    
    console.log('\n✅ All tests completed!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB\n');
  }
}

// Run tests
testBugFixes();
