const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://company-app:company-app123@cluster0.4e12bpv.mongodb.net/daily_activity?retryWrites=true&w=majority';

async function clearDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('daily_activity');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Found collections:', collections.map(c => c.name));
    
    // Drop all collections
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`Dropped collection: ${collection.name}`);
    }
    
    console.log('Database cleared successfully!');
    
    // Create sample data
    const activities = [
      {
        title: "Morning Meditation",
        description: "Start your day with a peaceful 10-minute meditation session",
        category: "Mindfulness",
        difficulty: "Easy",
        estimatedTime: 10,
        instructions: [
          "Find a quiet space and sit comfortably",
          "Close your eyes and focus on your breathing",
          "Let thoughts pass without judgment",
          "Return focus to breath when mind wanders"
        ],
        tags: ["meditation", "morning", "peaceful"],
        benefits: ["Reduced stress", "Better focus", "Calm mind"]
      },
      {
        title: "Creative Writing",
        description: "Express yourself through creative writing exercises",
        category: "Creativity",
        difficulty: "Medium",
        estimatedTime: 30,
        instructions: [
          "Choose a writing prompt or topic",
          "Set a timer for 30 minutes",
          "Write continuously without editing",
          "Let your creativity flow freely"
        ],
        tags: ["writing", "creativity", "expression"],
        benefits: ["Enhanced creativity", "Self-expression", "Mental clarity"]
      },
      {
        title: "Quick Workout",
        description: "High-intensity 15-minute workout to boost energy",
        category: "Fitness",
        difficulty: "Hard",
        estimatedTime: 15,
        instructions: [
          "Warm up with light stretching",
          "Perform 3 rounds of: 10 pushups, 15 squats, 30-second plank",
          "Take 1-minute rest between rounds",
          "Cool down with stretching"
        ],
        tags: ["fitness", "workout", "energy"],
        benefits: ["Increased energy", "Better fitness", "Mood boost"]
      },
      {
        title: "Learn Something New",
        description: "Dedicate time to learning a new skill or topic",
        category: "Learning",
        difficulty: "Medium",
        estimatedTime: 45,
        instructions: [
          "Choose a topic you're curious about",
          "Find reliable learning resources",
          "Take notes as you learn",
          "Practice or apply what you've learned"
        ],
        tags: ["learning", "skills", "growth"],
        benefits: ["Knowledge expansion", "Skill development", "Mental stimulation"]
      },
      {
        title: "Organize Workspace",
        description: "Clean and organize your work area for better productivity",
        category: "Productivity",
        difficulty: "Easy",
        estimatedTime: 20,
        instructions: [
          "Clear all unnecessary items from desk",
          "Organize papers and documents",
          "Clean computer screen and keyboard",
          "Arrange essential items within reach"
        ],
        tags: ["organization", "productivity", "cleaning"],
        benefits: ["Better focus", "Reduced distractions", "Improved efficiency"]
      }
    ];
    
    // Insert sample activities
    const activitiesCollection = db.collection('activities');
    const insertedActivities = await activitiesCollection.insertMany(activities);
    console.log(`Inserted ${insertedActivities.insertedCount} sample activities`);
    
    console.log('Sample data created successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

clearDatabase();