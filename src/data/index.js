// Central export file for all mock data
import mockActivities from './mockActivities.js';
import mockUsers from './mockUsers.js';
import mockUserActivities from './mockUserActivities.js';

export {
  mockActivities,
  mockUsers,
  mockUserActivities
};

// Helper function to get sample data by type
export const getMockData = (type) => {
  switch (type) {
    case 'activities':
      return mockActivities;
    case 'users':
      return mockUsers;
    case 'userActivities':
      return mockUserActivities;
    default:
      return null;
  }
};

// Function to get activities by category
export const getActivitiesByCategory = (category) => {
  return mockActivities.filter(activity => activity.category === category);
};

// Function to get activities by difficulty
export const getActivitiesByDifficulty = (difficulty) => {
  return mockActivities.filter(activity => activity.difficulty === difficulty);
};

// Function to get user activities by status
export const getUserActivitiesByStatus = (status) => {
  return mockUserActivities.filter(activity => activity.status === status);
};

export default {
  mockActivities,
  mockUsers,
  mockUserActivities,
  getMockData,
  getActivitiesByCategory,
  getActivitiesByDifficulty,
  getUserActivitiesByStatus
};