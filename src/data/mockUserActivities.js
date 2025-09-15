// Sample user activity records for testing
export const mockUserActivities = [
  // Alex Johnson's activities
  {
    userId: "user1", // This would be Alex Johnson's ID
    activityId: "activity1", // 5-minute meditation
    status: "completed",
    completedAt: new Date("2025-09-14T08:00:00Z"),
    timeSpent: 5,
    rating: 5,
    feedback: "Very calming way to start the day!",
    notes: "Did this first thing in the morning"
  },
  {
    userId: "user1",
    activityId: "activity5", // Organize workspace
    status: "completed",
    completedAt: new Date("2025-09-13T14:30:00Z"),
    timeSpent: 25,
    rating: 4,
    feedback: "Felt much more productive afterwards",
    notes: "Found some old notes I thought I lost"
  },
  {
    userId: "user1",
    activityId: "activity2", // Gratitude journaling
    status: "completed",
    completedAt: new Date("2025-09-12T20:00:00Z"),
    timeSpent: 8,
    rating: 4,
    feedback: "Nice way to end the day positively"
  },

  // Sarah Chen's activities
  {
    userId: "user2",
    activityId: "activity3", // Creative writing
    status: "completed",
    completedAt: new Date("2025-09-13T16:00:00Z"),
    timeSpent: 35,
    rating: 5,
    feedback: "Loved the creative challenge!",
    notes: "Wrote about a magical library - very inspiring"
  },
  {
    userId: "user2",
    activityId: "activity7", // Learn new language
    status: "completed",
    completedAt: new Date("2025-09-12T19:00:00Z"),
    timeSpent: 20,
    rating: 4,
    feedback: "Learning Spanish words was fun",
    notes: "Focused on food-related vocabulary"
  },
  {
    userId: "user2",
    activityId: "activity4", // Sketching
    status: "favorited",
    completedAt: null,
    timeSpent: null,
    rating: null,
    feedback: "",
    notes: "Want to try this with my coffee cup"
  },

  // Mike Rodriguez's activities
  {
    userId: "user3",
    activityId: "activity8", // Stretching
    status: "completed",
    completedAt: new Date("2025-09-14T07:00:00Z"),
    timeSpent: 12,
    rating: 4,
    feedback: "Great for morning stiffness",
    notes: "Added some extra shoulder stretches"
  },
  {
    userId: "user3",
    activityId: "activity9", // Indoor walking
    status: "completed",
    completedAt: new Date("2025-09-13T15:30:00Z"),
    timeSpent: 10,
    rating: 3,
    feedback: "Good energy boost during work",
    notes: "Walked around the office building"
  },
  {
    userId: "user3",
    activityId: "activity10", // Call friend
    status: "completed",
    completedAt: new Date("2025-09-12T18:00:00Z"),
    timeSpent: 25,
    rating: 5,
    feedback: "Caught up with college roommate - amazing!",
    notes: "We're planning a reunion trip"
  },

  // Emma Wilson's activities
  {
    userId: "user4",
    activityId: "activity11", // Mindful shower
    status: "completed",
    completedAt: new Date("2025-09-14T09:00:00Z"),
    timeSpent: 15,
    rating: 5,
    feedback: "So relaxing and grounding",
    notes: "Used lavender body wash for extra relaxation"
  },
  {
    userId: "user4",
    activityId: "activity1", // Meditation
    status: "completed",
    completedAt: new Date("2025-09-13T21:00:00Z"),
    timeSpent: 7,
    rating: 4,
    feedback: "Helped me wind down before bed"
  },
  {
    userId: "user4",
    activityId: "activity4", // Sketching
    status: "pending",
    completedAt: null,
    timeSpent: null,
    rating: null,
    feedback: "",
    notes: "Planning to sketch my houseplant later today"
  },

  // David Kim's activities
  {
    userId: "user5",
    activityId: "activity7", // Learn language
    status: "completed",
    completedAt: new Date("2025-09-14T12:00:00Z"),
    timeSpent: 30,
    rating: 4,
    feedback: "Learning Japanese kanji - challenging but rewarding",
    notes: "Focused on basic characters for daily life"
  },
  {
    userId: "user5",
    activityId: "activity6", // Plan priorities
    status: "completed",
    completedAt: new Date("2025-09-13T22:00:00Z"),
    timeSpent: 20,
    rating: 5,
    feedback: "Excellent for staying organized",
    notes: "Used time-blocking method for tomorrow's schedule"
  },
  {
    userId: "user5",
    activityId: "activity3", // Creative writing
    status: "skipped",
    completedAt: null,
    timeSpent: null,
    rating: null,
    feedback: "Not in creative mood today",
    notes: "Maybe try again tomorrow when more inspired"
  }
];

export default mockUserActivities;