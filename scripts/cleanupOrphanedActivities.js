/**
 * Cleanup Script: Remove Orphaned User Activities
 * 
 * This script removes UserActivity documents where the referenced Activity no longer exists.
 * Run this script to clean up the database and fix activity count mismatches.
 * 
 * Usage: node scripts/cleanupOrphanedActivities.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const UserActivity = require('../src/models/UserActivity');

async function cleanupOrphanedActivities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Finding orphaned user activities...');
    
    // Find all user activities and populate the activityId
    const allUserActivities = await UserActivity.find({}).populate('activityId');
    
    console.log(`📊 Total user activities found: ${allUserActivities.length}`);
    
    // Filter out activities where activityId is null (orphaned)
    const orphanedActivities = allUserActivities.filter(ua => !ua.activityId);
    
    console.log(`🚨 Orphaned activities found: ${orphanedActivities.length}`);
    
    if (orphanedActivities.length === 0) {
      console.log('✨ No orphaned activities found. Database is clean!');
      await mongoose.connection.close();
      return;
    }

    console.log('\n📋 Orphaned activities details:');
    orphanedActivities.forEach((ua, index) => {
      console.log(`  ${index + 1}. UserActivity ID: ${ua._id}`);
      console.log(`     User ID: ${ua.userId}`);
      console.log(`     Status: ${ua.status}`);
      console.log(`     Created: ${ua.createdAt}`);
      console.log('');
    });

    // Ask for confirmation (in a real script, you might use readline-sync or similar)
    console.log('⚠️  These orphaned activities will be deleted.');
    console.log('⚠️  This action cannot be undone!');
    console.log('\n🗑️  Deleting orphaned activities...\n');

    const orphanedIds = orphanedActivities.map(ua => ua._id);
    const result = await UserActivity.deleteMany({ _id: { $in: orphanedIds } });

    console.log(`✅ Successfully deleted ${result.deletedCount} orphaned activities`);
    console.log('\n🎉 Database cleanup complete!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the cleanup
cleanupOrphanedActivities();
