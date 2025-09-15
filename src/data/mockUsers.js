// Sample users for testing the "What To Do" app
export const mockUsers = [
  {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    preferences: {
      skillGoals: ["Mindfulness", "Productivity"],
      difficultyPreference: "Medium",
      availableTime: 20
    },
    streak: {
      current: 7,
      longest: 15,
      lastActivityDate: new Date("2025-09-14")
    },
    badges: ["Early Bird", "Mindful Master"]
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    preferences: {
      skillGoals: ["Creativity", "Learning"],
      difficultyPreference: "Hard",
      availableTime: 45
    },
    streak: {
      current: 3,
      longest: 8,
      lastActivityDate: new Date("2025-09-13")
    },
    badges: ["Creative Soul", "Quick Learner"]
  },
  {
    name: "Mike Rodriguez",
    email: "mike.rodriguez@example.com",
    preferences: {
      skillGoals: ["Fitness", "Social"],
      difficultyPreference: "Easy",
      availableTime: 15
    },
    streak: {
      current: 12,
      longest: 20,
      lastActivityDate: new Date("2025-09-14")
    },
    badges: ["Fitness Fanatic", "Social Butterfly", "Consistent Performer"]
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    preferences: {
      skillGoals: ["Self-Care", "Mindfulness", "Creativity"],
      difficultyPreference: "Medium",
      availableTime: 30
    },
    streak: {
      current: 5,
      longest: 12,
      lastActivityDate: new Date("2025-09-14")
    },
    badges: ["Self-Care Champion", "Balanced Life"]
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    preferences: {
      skillGoals: ["Learning", "Productivity", "Communication"],
      difficultyPreference: "Hard",
      availableTime: 60
    },
    streak: {
      current: 1,
      longest: 5,
      lastActivityDate: new Date("2025-09-14")
    },
    badges: ["Knowledge Seeker"]
  }
];

export default mockUsers;