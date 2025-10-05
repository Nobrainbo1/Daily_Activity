import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function updatePomodoroActivity() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('activities');

    // Find the Pomodoro Focus Session activity
    const activity = await collection.findOne({ title: 'Pomodoro Focus Session' });
    
    if (!activity) {
      console.log('❌ Pomodoro Focus Session activity not found');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ Found Pomodoro Focus Session activity');

    // Update step 3 (index 2) to add the music tip
    const updatedSteps = activity.steps.map((step, index) => {
      if (index === 2) { // Step 3 (25-minute focus timer)
        return {
          ...step,
          tips: [
            ...step.tips,
            'Listen to focus music: https://www.youtube.com/watch?v=8b3fqIBrNW0'
          ]
        };
      }
      return step;
    });

    // Update the activity with new steps
    await collection.updateOne(
      { title: 'Pomodoro Focus Session' },
      { $set: { steps: updatedSteps } }
    );

    console.log('✅ Added music video tip to Step 3');
    console.log('\nUpdated Step 3 tips:');
    updatedSteps[2].tips.forEach((tip, i) => {
      console.log(`  ${i + 1}. ${tip}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error updating activity:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updatePomodoroActivity();
