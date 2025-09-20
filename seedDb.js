// Simple script to populate database with activities
const mongoose = require('mongoose');

// Connect to MongoDB
async function seedActivities() {
  try {
    await mongoose.connect('mongodb+srv://company-app:company-app123@cluster0.4e12bpv.mongodb.net/daily_activity?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Define Activity schema
    const activitySchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      estimatedTime: { type: Number, required: true },
      difficulty: { type: String, required: true },
      instructions: [String],
      tags: [String]
    });

    const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

    // Sample activities
    const activities = [
      {
        title: "Morning Meditation",
        description: "Start your day with 10 minutes of mindfulness meditation to center yourself and set positive intentions.",
        category: "Mindfulness",
        estimatedTime: 10,
        difficulty: "Easy",
        instructions: [
          "Find a quiet, comfortable space",
          "Sit or lie down comfortably", 
          "Close your eyes and focus on your breath",
          "When your mind wanders, gently return focus to breathing",
          "Continue for 10 minutes"
        ],
        tags: ["morning", "meditation", "mindfulness"]
      },
      {
        title: "Quick Workout",
        description: "A 15-minute high-energy workout to boost your metabolism and energy levels throughout the day.",
        category: "Fitness",
        estimatedTime: 15,
        difficulty: "Medium",
        instructions: [
          "Warm up with light stretching (2 minutes)",
          "Do jumping jacks for 1 minute",
          "Perform push-ups for 2 minutes", 
          "Do squats for 2 minutes",
          "Plank hold for 1 minute",
          "Cool down with stretching (7 minutes)"
        ],
        tags: ["workout", "fitness", "energy"]
      },
      {
        title: "Creative Writing",
        description: "Spend 20 minutes writing creatively to enhance imagination and express your thoughts and feelings.",
        category: "Creativity",
        estimatedTime: 20,
        difficulty: "Easy",
        instructions: [
          "Choose a comfortable writing space",
          "Pick a prompt or write freely",
          "Set a timer for 20 minutes",
          "Write continuously without editing",
          "Review and reflect on what you wrote"
        ],
        tags: ["writing", "creativity", "expression"]
      },
      {
        title: "Learn Something New",
        description: "Dedicate 30 minutes to learning a new skill, language, or topic that interests you.",
        category: "Learning",
        estimatedTime: 30,
        difficulty: "Medium",
        instructions: [
          "Choose a learning platform or resource",
          "Select a topic that interests you",
          "Focus on one concept at a time",
          "Take notes or practice actively",
          "Review what you learned"
        ],
        tags: ["learning", "skill", "education"]
      },
      {
        title: "Nature Walk",
        description: "Take a peaceful 25-minute walk outdoors to connect with nature and get fresh air.",
        category: "Self-Care",
        estimatedTime: 25,
        difficulty: "Easy",
        instructions: [
          "Choose a safe outdoor route",
          "Walk at a comfortable pace",
          "Pay attention to your surroundings",
          "Take deep breaths of fresh air",
          "Stay present and mindful"
        ],
        tags: ["nature", "walk", "outdoors"]
      }
    ];

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Insert new activities
    const result = await Activity.insertMany(activities);
    console.log(`Inserted ${result.length} activities`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedActivities();