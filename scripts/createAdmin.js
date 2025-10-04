import dotenv from 'dotenv';
import connectDB from '../src/lib/mongodb.js';
import User from '../src/models/User.js';

// Load environment variables
dotenv.config();

async function createAdmin() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      preferences: {
        skillGoals: ['Creativity', 'Mindfulness', 'Productivity', 'Communication', 'Fitness', 'Learning', 'Social', 'Self-Care'],
        difficultyPreference: 'Medium',
        availableTime: 60
      },
      streak: {
        current: 0,
        longest: 0,
        lastActivityDate: null
      },
      badges: ['admin']
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
