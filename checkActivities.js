// Check Activities in Database
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://GanozaAdmin:C1XYojmOtuuHNFSN@cluster0.z8gxl2i.mongodb.net/daily_activity?retryWrites=true&w=majority&appName=Cluster0';

async function checkActivities() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database:', mongoose.connection.db.databaseName);
    
    // Get activities collection
    const db = mongoose.connection.db;
    const activities = await db.collection('activities').find({}).toArray();
    
    console.log('\n📊 Activities in database:', activities.length);
    
    if (activities.length === 0) {
      console.log('\n❌ NO ACTIVITIES FOUND!');
      console.log('This is why the activities page is empty.');
      console.log('\n💡 SOLUTION: Create activities through the web form');
      console.log('   Go to: http://localhost:3001/admin/add-activity');
      console.log('   Or run: node seedActivitiesWithSteps.js');
    } else {
      console.log('\n✅ Activities found! Here they are:\n');
      activities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.title || activity.name || 'NO TITLE'}`);
        console.log(`   - Category: ${activity.category || 'N/A'}`);
        console.log(`   - Difficulty: ${activity.difficulty || 'N/A'}`);
        console.log(`   - Has title field: ${activity.title ? '✅' : '❌'}`);
        console.log(`   - Has name field: ${activity.name ? '✅' : '❌'}`);
        console.log(`   - Steps: ${activity.steps?.length || 0}`);
        console.log('');
      });
      
      // Check if any activities have wrong field names
      const wrongFieldActivities = activities.filter(a => a.name && !a.title);
      if (wrongFieldActivities.length > 0) {
        console.log(`⚠️  WARNING: ${wrongFieldActivities.length} activities have "name" instead of "title"`);
        console.log('These activities will NOT show on the web page!');
        console.log('\n💡 SOLUTION: Delete these and create new ones with the fixed form');
      }
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkActivities();
