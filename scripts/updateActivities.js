import dotenv from 'dotenv';
import connectDB from '../src/lib/mongodb.js';
import Activity from '../src/models/Activity.js';
import { mockActivitiesWithSteps } from '../src/data/activitiesWithSteps.js';

// Load environment variables
dotenv.config();

async function updateActivities() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing activities
    console.log('Clearing existing activities...');
    await Activity.deleteMany({});
    console.log('✅ Existing activities cleared');

    // Insert new activities
    console.log('Inserting new activities...');
    const activities = await Activity.insertMany(mockActivitiesWithSteps);
    console.log(`✅ Successfully inserted ${activities.length} activities`);

    // Display summary
    console.log('\n📊 Activity Summary:');
    const categories = {};
    activities.forEach(activity => {
      categories[activity.category] = (categories[activity.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} activities`);
    });

    console.log('\n🎯 Activities with steps:');
    activities.forEach(activity => {
      console.log(`  - ${activity.title}: ${activity.steps.length} steps`);
    });

  } catch (error) {
    console.error('Error updating activities:', error);
  } finally {
    process.exit(0);
  }
}

updateActivities();
