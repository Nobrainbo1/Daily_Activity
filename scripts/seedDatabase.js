// Database seed script to populate activities
const mongoose = require('mongoose');
require('dotenv').config();

const sampleActivities = [
  {
    name: "Morning Meditation",
    description: "Start your day with 10 minutes of mindfulness meditation to center yourself and set positive intentions.",
    category: "Wellness",
    duration: 10,
    difficulty: "Easy",
    benefits: ["Reduces stress", "Improves focus", "Enhances mood"],
    instructions: [
      "Find a quiet, comfortable space",
      "Sit or lie down comfortably", 
      "Close your eyes and focus on your breath",
      "When your mind wanders, gently return focus to breathing",
      "Continue for 10 minutes"
    ],
    image: "🧘‍♀️"
  },
  {
    name: "Quick Workout",
    description: "A 15-minute high-energy workout to boost your metabolism and energy levels throughout the day.",
    category: "Fitness",
    duration: 15,
    difficulty: "Medium",
    benefits: ["Increases energy", "Improves cardiovascular health", "Boosts metabolism"],
    instructions: [
      "Warm up with light stretching (2 minutes)",
      "Do jumping jacks for 1 minute",
      "Perform push-ups for 2 minutes", 
      "Do squats for 2 minutes",
      "Plank hold for 1 minute",
      "Cool down with stretching (7 minutes)"
    ],
    image: "💪"
  },
  {
    name: "Creative Writing",
    description: "Spend 20 minutes writing creatively to enhance imagination and express your thoughts and feelings.",
    category: "Creativity",
    duration: 20,
    difficulty: "Easy",
    benefits: ["Improves creativity", "Enhances self-expression", "Reduces stress"],
    instructions: [
      "Choose a comfortable writing space",
      "Pick a prompt or write freely",
      "Set a timer for 20 minutes",
      "Write continuously without editing",
      "Review and reflect on what you wrote"
    ],
    image: "✍️"
  },
  {
    name: "Learn Something New",
    description: "Dedicate 30 minutes to learning a new skill, language, or topic that interests you.",
    category: "Education",
    duration: 30,
    difficulty: "Medium",
    benefits: ["Expands knowledge", "Improves cognitive function", "Builds confidence"],
    instructions: [
      "Choose a learning platform or resource",
      "Select a topic that interests you",
      "Focus on one concept at a time",
      "Take notes or practice actively",
      "Review what you learned"
    ],
    image: "📚"
  },
  {
    name: "Nature Walk",
    description: "Take a peaceful 25-minute walk outdoors to connect with nature and get fresh air.",
    category: "Wellness",
    duration: 25,
    difficulty: "Easy",
    benefits: ["Improves mood", "Increases vitamin D", "Reduces stress"],
    instructions: [
      "Choose a safe outdoor route",
      "Walk at a comfortable pace",
      "Pay attention to your surroundings",
      "Take deep breaths of fresh air",
      "Stay present and mindful"
    ],
    image: "🚶‍♀️"
  },
  {
    name: "Healthy Cooking",
    description: "Prepare a nutritious meal or snack to nourish your body and practice culinary skills.",
    category: "Health",
    duration: 45,
    difficulty: "Medium",
    benefits: ["Improves nutrition", "Saves money", "Builds life skills"],
    instructions: [
      "Plan your meal with fresh ingredients",
      "Gather all necessary tools and ingredients",
      "Follow a healthy recipe or create your own",
      "Focus on balanced nutrition",
      "Enjoy your homemade meal mindfully"
    ],
    image: "🥗"
  },
  {
    name: "Digital Detox",
    description: "Take a 60-minute break from all digital devices to reconnect with yourself and your environment.",
    category: "Wellness",
    duration: 60,
    difficulty: "Hard",
    benefits: ["Reduces screen time", "Improves focus", "Enhances real-world connections"],
    instructions: [
      "Turn off all digital devices",
      "Inform others you'll be unavailable",
      "Engage in analog activities (reading, drawing, talking)",
      "Spend time in nature if possible",
      "Reflect on the experience"
    ],
    image: "📵"
  },
  {
    name: "Gratitude Practice",
    description: "Spend 10 minutes reflecting on and writing down things you're grateful for.",
    category: "Wellness",
    duration: 10,
    difficulty: "Easy",
    benefits: ["Improves mood", "Increases positivity", "Enhances life satisfaction"],
    instructions: [
      "Find a quiet space with pen and paper",
      "Think about your day, week, or life",
      "Write down 5-10 things you're grateful for",
      "Be specific and detailed",
      "Feel the positive emotions as you write"
    ],
    image: "🙏"
  },
  {
    name: "Skill Practice",
    description: "Practice a skill you want to improve for 30 minutes with focused attention.",
    category: "Education",
    duration: 30,
    difficulty: "Medium",
    benefits: ["Builds expertise", "Increases confidence", "Provides sense of achievement"],
    instructions: [
      "Choose a skill you want to develop",
      "Set specific practice goals",
      "Focus on deliberate practice",
      "Track your progress",
      "Celebrate small improvements"
    ],
    image: "🎯"
  },
  {
    name: "Social Connection",
    description: "Reach out to a friend or family member for meaningful conversation and connection.",
    category: "Social",
    duration: 20,
    difficulty: "Easy",
    benefits: ["Strengthens relationships", "Improves mood", "Reduces loneliness"],
    instructions: [
      "Choose someone you want to connect with",
      "Call, text, or meet in person",
      "Ask meaningful questions",
      "Listen actively and empathetically",
      "Share something personal about yourself"
    ],
    image: "👥"
  }
];

// Define Activity schema
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true },
  benefits: [String],
  instructions: [String],
  image: String
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daily_activity';
  
  try {
    await mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');
    
    // Insert sample activities
    const result = await Activity.insertMany(sampleActivities);
    console.log(`Inserted ${result.length} activities`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleActivities, seedDatabase };