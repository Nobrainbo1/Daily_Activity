# Daily Activity

A web application that helps users discover productive ways to spend their free time through personalized activity suggestions focused on personal development and skill-building.

## Live Demo

🔗 [View Live Application](https://wad-6510249.indonesiacentral.cloudapp.azure.com/Daily_Activity)

User account to test

- Nomal user
  - MJ8888, MJ8822
- Admin user
  - admin, admin123

## Team Members

- Nattphat Kraiwong - https://github.com/Nobrainbo1
- Nutchanon Tongkumbanchong - https://github.com/Nutchanon-Tongkumbanchong
- Krit Japhong - https://github.com/krit-IS-me

## About

Daily Activity helps users overcome decision fatigue when choosing how to spend their free time. The application provides personalized activity recommendations across multiple categories, helping users develop new skills and maintain productive habits.

### Features

- Personalized onboarding flow for user preferences
- Activity browsing with 8 different categories
- Step-by-step activity execution with progress tracking
- User dashboard with activity status tracking
- Skip functionality for flexible activity management

### Tech Stack

- **Frontend:** Next.js 15, React 19
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm

## Data Models

### User

User account and preference information.

**Fields:**

- `name` - User's display name
- `username` - Unique username (3-20 characters)
- `password` - Hashed password
- `preferences.skillGoals` - Array of selected categories
- `preferences.difficultyPreference` - Easy, Medium, or Hard
- `preferences.availableTime` - Available time in minutes
- `role` - User role (user or admin)

### Activity

Activity templates available in the system.

**Fields:**

- `title` - Activity name
- `description` - Activity description
- `category` - Activity category (Creativity, Mindfulness, Productivity, Communication, Fitness, Learning, Social, Self-Care)
- `difficulty` - Easy, Medium, or Hard
- `estimatedTime` - Time in minutes
- `instructions` - Array of instruction strings
- `steps` - Array of step objects containing stepNumber, title, description, tips, and optional videoUrl
- `tags` - Searchable tags

### UserActivity

User progress on specific activities.

**Fields:**

- `userId` - Reference to User
- `activityId` - Reference to Activity
- `status` - Current status (added, in-progress, completed, skipped)
- `progress.currentStep` - Current step number
- `progress.completedSteps` - Array of completed step numbers

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Activities

- `GET /api/activities` - Retrieve all activities

### User Activities

- `GET /api/user-activities` - Get user activities (supports query params: userId, id, stats)
- `POST /api/user-activities` - Add activity to user list
- `PUT /api/user-activities` - Update activity status
- `PATCH /api/user-activities` - Update activity progress
- `DELETE /api/user-activities` - Remove activity

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update` - Update user information
- `PATCH /api/users/update` - Partial user update
- `PATCH /api/users/update-password` - Update password
- `DELETE /api/users/delete` - Delete user account

## Data Models

### User

Stores user account information and preferences.

**Fields:**

- `name`: String (Display name)
- `username`: String (unique, 3-20 chars)
- `password`: String (hashed, min 6 chars)
- `preferences`: Object
  - `skillGoals`: Array of Strings (selected categories)
  - `difficultyPreference`: String (Easy, Medium, Hard)
  - `availableTime`: Number (in minutes: 15, 30, 60, 120)
- `role`: String (user, admin)
- `timestamps`: createdAt, updatedAt

### Activity

Represents activities available in the system.

**Fields:**

- `title`: String (required)
- `description`: String (required)
- `category`: String (Creativity, Mindfulness, Productivity, Communication, Fitness, Learning, Social, Self-Care)
- `difficulty`: String (Easy, Medium, Hard)
- `estimatedTime`: Number (in minutes)
- `instructions`: Array of Strings (optional)
- `steps`: Array of Objects (optional)
  - `stepNumber`: Number
  - `title`: String
  - `description`: String
  - `tips`: Array of Strings
  - `videoUrl`: String (optional)
- `tags`: Array of Strings
- `timestamps`: createdAt, updatedAt

### UserActivity

Tracks user interactions with activities.

**Fields:**

- `userId`: ObjectId (ref: User)
- `activityId`: ObjectId (ref: Activity)
- `status`: String (added, in-progress, completed, skipped)
- `progress`: Object
  - `currentStep`: Number
  - `completedSteps`: Array of Numbers
  - `lastUpdated`: Date

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Activities

- `GET /api/activities` - Get all activities

### User Activities

- `GET /api/user-activities?userId={id}` - Get user's activities
- `GET /api/user-activities?id={userActivityId}` - Get specific user activity
- `GET /api/user-activities?userId={id}&stats=true` - Get user stats
- `POST /api/user-activities` - Add activity to user (with duplicate prevention)
- `PUT /api/user-activities` - Update activity status
- `PATCH /api/user-activities` - Update activity progress
- `DELETE /api/user-activities` - Remove activity from user

### Users

- `GET /api/users/profile?userId={id}` - Get user profile
- `PUT /api/users/update` - Update user profile
- `PATCH /api/users/update` - Partial update user data
- `PATCH /api/users/update-password` - Change password
- `DELETE /api/users/delete?userId={id}` - Delete user account

### Admin

- `POST /api/seed` - Seed database with initial data

## How to Use the App

https://youtu.be/z3xd8iDyVZo
