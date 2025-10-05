/**
 * Cleanup Script: Remove Badges Field from Users
 * 
 * This script removes the badges array field from all user documents in MongoDB.
 * This is a one-time cleanup to remove deprecated badge functionality.
 * 
 * Usage: node scripts/removeBadgesFromUsers.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function removeBadgesFromUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Removing badges field from all users...');
    
    // Remove the badges field from all user documents
    const result = await mongoose.connection.db.collection('users').updateMany(
      {}, // Match all documents
      { $unset: { badges: "" } } // Remove the badges field
    );

    console.log(`📊 Modified ${result.modifiedCount} user documents`);
    console.log(`✅ Successfully removed badges field from all users`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the cleanup
removeBadgesFromUsers();
