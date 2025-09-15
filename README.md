# What To Do - Daily Activity Recommendation App

A web application designed to help users discover productive and meaningful ways to spend their free time through personalized daily activity suggestions focused on personal development, skill-building, and mental wellbeing.

## Team Members

- Nattphat Kraiwong - https://github.com/Nobrainbo1
- Nutchanon Tongkumbanchong - https://github.com/Nutchanon-Tongkumbanchong
- Krit Japhong - https://github.com/krit-IS-me

## Project Description

Many people struggle with deciding how to spend their free time productively or meaningfully. **What To Do** is a web app designed to solve this by suggesting personalized daily activities focused on personal development, skill-building, and mental wellbeing. Users receive tailored recommendations based on their interests and goals, helping them overcome boredom and grow every day.

### Key Features

- 🎯 Personalized activity suggestions based on user preferences and goals
- 📊 Categorized activities by skill area (Creativity, Mindfulness, Productivity) and difficulty
- 📈 User activity tracking to monitor completion status and maintain motivation
- 🏆 Progress dashboard showing streaks, badges, and achievements
- ❤️ Ability to save favorite activities and explore new ones anytime

### Technology Stack

- **Frontend:** Next.js with React
- **Backend:** RESTful API built with Next.js API routes
- **Database:** MongoDB with Mongoose ODM
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Data Models

### User

- Profile information and growth preferences
- Fields: id, name, email, preferences (skill goals)

### Activity

- Suggested tasks to improve personality or skills
- Fields: id, title, description, category, difficulty, estimated_time

### UserActivity

- Tracks each user's interaction with activities
- Fields: id, userId, activityId, status (pending/completed/skipped), date

## How to Use the App
