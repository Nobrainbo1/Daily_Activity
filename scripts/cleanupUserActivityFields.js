/**
 * Clean up unused fields from UserActivity collection
 * This script removes fields that are not currently used in the application:
 * - scheduledTime
 * - scheduledDate
 * - timeSpent
 * - rating
 * - feedback
 * - notes
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function cleanupUserActivityFields() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('useractivities');

    // Count documents that have any of these fields
    const docsWithUnusedFields = await collection.countDocuments({
      $or: [
        { scheduledTime: { $exists: true } },
        { scheduledDate: { $exists: true } },
        { timeSpent: { $exists: true } },
        { rating: { $exists: true } },
        { feedback: { $exists: true } },
        { notes: { $exists: true } }
      ]
    });

    console.log(`\n📊 Found ${docsWithUnusedFields} documents with unused fields`);

    if (docsWithUnusedFields === 0) {
      console.log('✅ No cleanup needed - all documents are clean!');
      await mongoose.connection.close();
      return;
    }

    // Remove unused fields
    console.log('\n🧹 Removing unused fields...');
    const result = await collection.updateMany(
      {},
      {
        $unset: {
          scheduledTime: '',
          scheduledDate: '',
          timeSpent: '',
          rating: '',
          feedback: '',
          notes: ''
        }
      }
    );

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Modified ${result.modifiedCount} documents`);
    console.log(`   Matched ${result.matchedCount} documents`);

    // Verify cleanup
    const remainingDocs = await collection.countDocuments({
      $or: [
        { scheduledTime: { $exists: true } },
        { scheduledDate: { $exists: true } },
        { timeSpent: { $exists: true } },
        { rating: { $exists: true } },
        { feedback: { $exists: true } },
        { notes: { $exists: true } }
      ]
    });

    console.log(`\n🔍 Verification: ${remainingDocs} documents still have unused fields`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

cleanupUserActivityFields();
