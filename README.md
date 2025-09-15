# What To Do - Daily Activity Recommendation App

A web application designed to help users discover productive and meaningful ways to spend their free time through personalized daily activity suggestions focused on personal development, skill-building, and mental wellbeing.

## Team Members

- [Your Name] - [Your GitHub Profile]
- [Member 2] - [Their GitHub Profile]
- [Member 3] - [Their GitHub Profile]

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

### For Users

1. **Browse Activities**: View available daily activities organized by categories (Creativity, Mindfulness, Productivity, etc.)
2. **Filter by Preferences**: Filter activities by difficulty level (Easy, Medium, Hard) and estimated time
3. **Track Progress**: Mark activities as completed, skipped, or save them as favorites
4. **View Statistics**: Check your completion streaks, progress by category, and overall achievements
5. **Get Recommendations**: Receive personalized activity suggestions based on your interaction history

### For Developers

- Access the REST API at `/api/` endpoints for CRUD operations
- MongoDB connection status can be checked at `/api/health` (to be implemented)
- View activity data and user interactions through the database models

## API Endpoints

### Users

- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user preferences

### Activities

- `GET /api/activities` - List all activities (with optional filtering)
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### User Activities

- `GET /api/users/:id/activities` - Get user's activity records
- `POST /api/users/:id/activities` - Log activity status
- `PUT /api/user-activities/:id` - Update activity status

## Screenshots

_Screenshots will be added here once the UI is developed_

## Development Timeline

- **Week 1:** Setup, API development, and core functionality
- **Week 2:** UI development, testing, and deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created for educational purposes as part of a university web application development course.
