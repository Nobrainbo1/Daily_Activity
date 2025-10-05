import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const newActivities = [
  {
    title: "Pomodoro Focus Session",
    description: "Master the Pomodoro Technique to boost productivity with focused 25-minute work intervals and short breaks.",
    category: "Productivity",
    difficulty: "Easy",
    estimatedTime: 30,
    tags: ["time-management", "focus", "productivity", "work"],
    instructions: [
      "Set up your workspace free from distractions",
      "Choose one task to focus on",
      "Set timer for 25 minutes and work without interruption",
      "Take a 5-minute break when timer goes off",
      "Repeat cycle 4 times, then take a longer 15-30 minute break"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Prepare Your Workspace",
        description: "Clear your desk, silence notifications, and gather all materials needed for your task.",
        tips: [
          "Put your phone on silent mode or in another room",
          "Close unnecessary browser tabs",
          "Have water and snacks ready before starting"
        ],
        videoUrl: "https://www.youtube.com/watch?v=VFW3Ld7JO0w",
        estimatedDuration: 5
      },
      {
        stepNumber: 2,
        title: "Select Your Task",
        description: "Choose one specific task to work on during this Pomodoro session.",
        tips: [
          "Pick a task that can be completed in 25 minutes",
          "If task is large, break it into smaller subtasks",
          "Write down your goal for this session"
        ],
        videoUrl: null,
        estimatedDuration: 3
      },
      {
        stepNumber: 3,
        title: "Start 25-Minute Focus Timer",
        description: "Set your timer for 25 minutes and work with full concentration on your chosen task.",
        tips: [
          "Use a dedicated Pomodoro timer app or website",
          "If interrupted, consider restarting the Pomodoro",
          "Stay focused on just this one task"
        ],
        videoUrl: "https://www.youtube.com/watch?v=mNBmG24djoY",
        estimatedDuration: 25
      },
      {
        stepNumber: 4,
        title: "Take a 5-Minute Break",
        description: "When timer rings, stop working immediately and take a short break.",
        tips: [
          "Stand up and stretch",
          "Get a drink of water",
          "Look away from screen to rest your eyes"
        ],
        videoUrl: null,
        estimatedDuration: 5
      }
    ],
    isActive: true
  },
  {
    title: "Active Listening Practice",
    description: "Develop strong communication skills by practicing active listening techniques in your daily conversations.",
    category: "Communication",
    difficulty: "Medium",
    estimatedTime: 20,
    tags: ["communication", "listening", "conversation", "empathy"],
    instructions: [
      "Find a conversation partner or join a discussion",
      "Focus completely on what the other person is saying",
      "Practice reflective listening techniques",
      "Ask clarifying questions",
      "Summarize what you heard to confirm understanding"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Prepare Your Mind",
        description: "Clear your mind and prepare to give someone your full attention.",
        tips: [
          "Put away all distractions (phone, laptop)",
          "Take three deep breaths to center yourself",
          "Set the intention to truly listen"
        ],
        videoUrl: "https://www.youtube.com/watch?v=7wUCyjiyXdg",
        estimatedDuration: 3
      },
      {
        stepNumber: 2,
        title: "Listen Without Interrupting",
        description: "Let the speaker finish their thoughts completely before responding.",
        tips: [
          "Maintain eye contact",
          "Nod to show you're following along",
          "Don't plan your response while they're talking"
        ],
        videoUrl: "https://www.youtube.com/watch?v=t685WM5R6aM",
        estimatedDuration: 5
      },
      {
        stepNumber: 3,
        title: "Reflect Back",
        description: "Paraphrase what you heard to ensure understanding.",
        tips: [
          "Start with 'So what I'm hearing is...'",
          "Don't just repeat word-for-word",
          "Check if your understanding is correct"
        ],
        videoUrl: null,
        estimatedDuration: 5
      },
      {
        stepNumber: 4,
        title: "Ask Open-Ended Questions",
        description: "Deepen the conversation by asking questions that invite elaboration.",
        tips: [
          "Use 'how' and 'what' instead of 'why'",
          "Show genuine curiosity",
          "Avoid judgment or advice unless asked"
        ],
        videoUrl: null,
        estimatedDuration: 7
      }
    ],
    isActive: true
  },
  {
    title: "Coffee Chat Connection",
    description: "Strengthen your social bonds by scheduling a casual one-on-one conversation with a friend, colleague, or acquaintance.",
    category: "Social",
    difficulty: "Easy",
    estimatedTime: 45,
    tags: ["social", "connection", "friendship", "networking"],
    instructions: [
      "Reach out to someone you'd like to connect with",
      "Schedule a time for coffee or virtual chat",
      "Prepare some conversation topics",
      "Be present and engaged during the conversation",
      "Follow up after the meeting"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Choose and Reach Out",
        description: "Select someone you want to connect with and send them a friendly invitation.",
        tips: [
          "Think of someone you haven't talked to recently",
          "Be specific about wanting to catch up",
          "Offer a few time options to make scheduling easy"
        ],
        videoUrl: "https://www.youtube.com/watch?v=5cQoGNEcc5Q",
        estimatedDuration: 10
      },
      {
        stepNumber: 2,
        title: "Prepare Conversation Topics",
        description: "Think of a few topics or questions to keep the conversation flowing naturally.",
        tips: [
          "Prepare 3-5 open-ended questions",
          "Think about recent events in their life",
          "Don't over-script - let conversation flow naturally"
        ],
        videoUrl: null,
        estimatedDuration: 5
      },
      {
        stepNumber: 3,
        title: "Have the Conversation",
        description: "Meet up and enjoy a genuine, present conversation.",
        tips: [
          "Put your phone away",
          "Listen more than you talk",
          "Share about yourself too",
          "Be authentic and curious"
        ],
        videoUrl: "https://www.youtube.com/watch?v=H6n3iNh4XLI",
        estimatedDuration: 30
      }
    ],
    isActive: true
  },
  {
    title: "Evening Wind-Down Routine",
    description: "Create a relaxing evening ritual to improve sleep quality and end your day with calm and intention.",
    category: "Self-Care",
    difficulty: "Easy",
    estimatedTime: 30,
    tags: ["self-care", "sleep", "relaxation", "routine"],
    instructions: [
      "Start routine 30-60 minutes before bedtime",
      "Dim the lights in your space",
      "Put away all electronic devices",
      "Engage in calming activities",
      "Prepare your space for restful sleep"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Digital Sunset",
        description: "Put away all screens and electronics at least 30 minutes before bed.",
        tips: [
          "Set a daily alarm as reminder",
          "Charge phone outside bedroom",
          "Use blue light filters if you must use devices"
        ],
        videoUrl: "https://www.youtube.com/watch?v=nm1TxQj9IsQ",
        estimatedDuration: 5
      },
      {
        stepNumber: 2,
        title: "Prepare Your Body",
        description: "Do gentle stretches or take a warm bath to relax your muscles.",
        tips: [
          "Try simple yoga stretches",
          "Use lavender or chamomile in bath",
          "Keep movements slow and gentle"
        ],
        videoUrl: "https://www.youtube.com/watch?v=BiWDsfZ3zbo",
        estimatedDuration: 10
      },
      {
        stepNumber: 3,
        title: "Calm Your Mind",
        description: "Journal, read, or practice light meditation to quiet mental chatter.",
        tips: [
          "Write down tomorrow's top 3 priorities",
          "Read fiction rather than work-related material",
          "Try a 5-minute guided meditation"
        ],
        videoUrl: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
        estimatedDuration: 10
      },
      {
        stepNumber: 4,
        title: "Set Your Sleep Space",
        description: "Make your bedroom cool, dark, and comfortable for optimal sleep.",
        tips: [
          "Aim for room temperature of 65-68°F (18-20°C)",
          "Use blackout curtains or eye mask",
          "Try white noise or nature sounds if needed"
        ],
        videoUrl: null,
        estimatedDuration: 5
      }
    ],
    isActive: true
  }
];

async function addNewActivities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('activities');

    // Check if any of these activities already exist
    for (const activity of newActivities) {
      const exists = await collection.findOne({ title: activity.title });
      if (exists) {
        console.log(`⚠️  Activity "${activity.title}" already exists, skipping...`);
        continue;
      }

      await collection.insertOne(activity);
      console.log(`✅ Added: ${activity.title} (${activity.category})`);
    }

    console.log('\n✨ All new activities added successfully!');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error adding activities:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

addNewActivities();
