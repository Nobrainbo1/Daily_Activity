# 🎨 Visual System Overview

## 📱 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOMEPAGE (/)                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🎨 Animated Gradient Background                        │    │
│  │  ┌─────────────────┐  ┌─────────────────────────┐     │    │
│  │  │  Hero Section   │  │   Auth Card              │     │    │
│  │  │  - Title        │  │   - Login/Signup Toggle  │     │    │
│  │  │  - Features     │  │   - Form Fields          │     │    │
│  │  │  - Benefits     │  │   - Submit Button        │     │    │
│  │  └─────────────────┘  └─────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                     [User Authenticates]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ACTIVITIES PAGE (/activities)                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Header: Welcome [Name] | My Activities | Logout       │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  Search Bar: 🔍 Search activities...                   │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  Category Filters:                                      │    │
│  │  [All] [Creativity] [Mindfulness] [Productivity] ...   │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  Activity Grid:                                         │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                     │    │
│  │  │Activity│ │Activity│ │Activity│                     │    │
│  │  │Card 1  │ │Card 2  │ │Card 3  │                     │    │
│  │  │• Badge │ │• Badge │ │• Badge │                     │    │
│  │  │• Title │ │• Title │ │• Title │                     │    │
│  │  │• Desc  │ │• Desc  │ │• Desc  │                     │    │
│  │  │• Meta  │ │• Meta  │ │• Meta  │                     │    │
│  │  │[Start] │ │[Start] │ │[Start] │                     │    │
│  │  └────────┘ └────────┘ └────────┘                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   [User Clicks "Start Activity"]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            ACTIVITY EXECUTION (/activity-execute/[id])           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ← Back to Activities                                   │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  Activity Header:                                       │    │
│  │  • Category Badge                                       │    │
│  │  • Title & Description                                  │    │
│  │  • Difficulty & Time                                    │    │
│  │  • Progress Bar: [████████░░] 80% (4/5 steps)          │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  Step 1: [✓ Completed]                                  │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │ ✓  Title: Find Your Space                    │     │    │
│  │  │    Description: Choose a quiet location...   │     │    │
│  │  │    💡 Tips: • Use cushion • Ventilation      │     │    │
│  │  │    🎥 [Watch Tutorial Video]                 │     │    │
│  │  │    ⏱️ Duration: 2 minutes                     │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                                                         │    │
│  │  Step 2: [✓ Completed]                                  │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │ ✓  Title: Proper Posture                     │     │    │
│  │  │    Description: Sit with back straight...    │     │    │
│  │  │    💡 Tips: • Align spine • Relax shoulders  │     │    │
│  │  │    🎥 [Watch Tutorial Video]                 │     │    │
│  │  │    ⏱️ Duration: 3 minutes                     │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                                                         │    │
│  │  Step 3: [⚪ In Progress]                               │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │ 3  Title: Focus on Breath                    │     │    │
│  │  │    Description: Close eyes and observe...    │     │    │
│  │  │    💡 Tips: • Notice sensations • Count      │     │    │
│  │  │    🎥 [Watch Tutorial Video]                 │     │    │
│  │  │    ⏱️ Duration: 10 minutes                    │     │    │
│  │  │    [Mark as Complete]                        │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   [User Completes All Steps]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CELEBRATION SCREEN                            │
│                                                                  │
│                         🎉 🎊 🌟                                │
│                                                                  │
│                   Congratulations!                               │
│              You've completed this activity!                     │
│                                                                  │
│            [Browse More Activities]                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │
       ├─ GET /api/activities
       ├─ GET /api/user-activities
       ├─ POST /api/user-activities
       ├─ PATCH /api/user-activities (NEW)
       └─ DELETE /api/user-activities
       │
┌──────▼────────────────────┐
│   Next.js API Routes      │
│  (Server-side handlers)   │
├───────────────────────────┤
│  • Activity Routes        │
│  • User Activity Routes   │
│  • Auth Routes            │
└──────┬────────────────────┘
       │
┌──────▼─────────────┐
│    Mongoose ODM    │
│  (Schema & Models) │
├────────────────────┤
│  • Activity.js     │
│  • UserActivity.js │
│  • User.js         │
└──────┬─────────────┘
       │
┌──────▼─────────┐
│    MongoDB     │
│   (Database)   │
├────────────────┤
│  Collections:  │
│  • activities  │
│  • users       │
│  • useractivs  │
└────────────────┘
```

---

## 📊 State Management Flow

```
┌────────────────────────────────────────────────────────┐
│           Activity Execution Component                  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Initial State:                                         │
│  ├─ activity = null                                     │
│  ├─ userActivity = null                                 │
│  ├─ currentStep = 0                                     │
│  ├─ completedSteps = Set()                             │
│  ├─ isStarted = false                                   │
│  └─ showCelebration = false                            │
│                                                         │
│  ┌──────────────────────────────────────────┐         │
│  │  useEffect (on mount)                     │         │
│  │  ├─ Fetch activity from API               │         │
│  │  ├─ Fetch user progress from API          │         │
│  │  └─ Initialize state with data            │         │
│  └──────────────────────────────────────────┘         │
│                  ↓                                      │
│  ┌──────────────────────────────────────────┐         │
│  │  User clicks "Start Activity"             │         │
│  │  ├─ PATCH /api/user-activities            │         │
│  │  │  ├─ Set status = 'pending'             │         │
│  │  │  ├─ Set startedAt = Date               │         │
│  │  │  └─ Set totalSteps = steps.length      │         │
│  │  └─ Update local state: isStarted = true  │         │
│  └──────────────────────────────────────────┘         │
│                  ↓                                      │
│  ┌──────────────────────────────────────────┐         │
│  │  User completes a step                    │         │
│  │  ├─ Toggle step in completedSteps Set     │         │
│  │  ├─ Calculate percentComplete             │         │
│  │  ├─ Check if all steps done               │         │
│  │  └─ PATCH /api/user-activities            │         │
│  │     ├─ Update progress.completedSteps     │         │
│  │     ├─ Update progress.percentComplete    │         │
│  │     └─ If all done: status='completed'    │         │
│  └──────────────────────────────────────────┘         │
│                  ↓                                      │
│  ┌──────────────────────────────────────────┐         │
│  │  All steps completed                      │         │
│  │  ├─ Show celebration animation            │         │
│  │  ├─ Set status = 'completed'              │         │
│  │  └─ Record completedAt timestamp          │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Category Color System

```
┌─────────────────┬───────────────────────────────────────────┐
│   Category      │   Gradient Color Scheme                    │
├─────────────────┼───────────────────────────────────────────┤
│  🎨 Creativity  │  Purple-500 → Pink-500 → Rose-500         │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  🧘 Mindfulness │  Blue-500 → Cyan-500 → Teal-500           │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  ⚡ Productivity│  Orange-500 → Amber-500 → Yellow-500      │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  💬 Communic... │  Indigo-500 → Purple-500 → Pink-500       │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  🏃 Fitness     │  Green-500 → Emerald-500 → Teal-500       │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  📚 Learning    │  Blue-600 → Indigo-600 → Purple-600       │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  👥 Social      │  Pink-500 → Rose-500 → Red-500            │
│                 │  [████████████████████████████]          │
├─────────────────┼───────────────────────────────────────────┤
│  💆 Self-Care   │  Violet-500 → Purple-500 → Fuchsia-500    │
│                 │  [████████████████████████████]          │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 📱 Responsive Layout Breakpoints

```
Mobile (< 768px):
┌─────────────────┐
│   Activity 1    │
├─────────────────┤
│   Activity 2    │
├─────────────────┤
│   Activity 3    │
└─────────────────┘

Tablet (768px - 1024px):
┌─────────────────┬─────────────────┐
│   Activity 1    │   Activity 2    │
├─────────────────┼─────────────────┤
│   Activity 3    │   Activity 4    │
└─────────────────┴─────────────────┘

Desktop (> 1024px):
┌─────────────────┬─────────────────┬─────────────────┐
│   Activity 1    │   Activity 2    │   Activity 3    │
├─────────────────┼─────────────────┼─────────────────┤
│   Activity 4    │   Activity 5    │   Activity 6    │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│  Homepage   │
│  /          │
└──────┬──────┘
       │
       ├─ Check localStorage for 'user'
       │
       ├─ If user exists:
       │  └─ Show "Go to Activities" button
       │
       └─ If no user:
          └─ Show login/signup form
             │
             ├─ User submits credentials
             │  └─ POST /api/auth/login or /api/auth/signup
             │
             ├─ If success:
             │  ├─ Save user to localStorage
             │  └─ Navigate to /activities
             │
             └─ If error:
                └─ Show error message

Protected Pages (activities, execution):
┌─────────────┐
│  Component  │
│  mounts     │
└──────┬──────┘
       │
       └─ useEffect: Check localStorage
          │
          ├─ If user found:
          │  └─ Continue rendering
          │
          └─ If no user:
             └─ router.push('/')
```

---

## 📊 Progress Tracking System

```
Activity Progress Object:
┌──────────────────────────────────────────┐
│  progress: {                              │
│    currentStep: 2,                        │
│    completedSteps: [                      │
│      { stepNumber: 1, completedAt: Date },│
│      { stepNumber: 2, completedAt: Date } │
│    ],                                     │
│    totalSteps: 3,                         │
│    percentComplete: 66,                   │
│    startedAt: Date                        │
│  }                                        │
└──────────────────────────────────────────┘

Visual Representation:
┌──────────────────────────────────────────┐
│  Overall Progress: 66%                    │
│  ██████████████████████░░░░░░░░░ 2/3     │
└──────────────────────────────────────────┘

Step Status:
┌──────────────────────────────────────────┐
│  Step 1: [✓] Completed    100%           │
│  Step 2: [✓] Completed    100%           │
│  Step 3: [ ] Not started    0%           │
└──────────────────────────────────────────┘

Calculation:
percentComplete = (completedSteps.length / totalSteps) * 100
                = (2 / 3) * 100
                = 66.67 ≈ 67%
```

---

## 🎬 Animation Timeline

```
Page Load:
0s    ├─ Background gradient starts
      │  └─ Blob 1 begins floating
2s    ├─ Blob 2 begins floating (delay)
4s    ├─ Blob 3 begins floating (delay)
7s    └─ Blob 1 completes cycle, repeats

User Interaction:
Click ├─ Scale transform: 1.0 → 1.05 (150ms)
      └─ Shadow grows (150ms)

Progress Update:
Step  ├─ Progress bar width transition (500ms)
Done  ├─ Checkmark appears (instant)
      └─ Green highlight fades in (300ms)

Celebration:
All   ├─ Confetti emoji bounces (0s)
Done  ├─ Congratulations text pulses (0s)
      └─ Auto-dismiss after 3 seconds
```

---

## 🗃️ Database Collections Schema

```
activities Collection:
┌─────────────────────────────────────────┐
│ {                                        │
│   _id: ObjectId("..."),                  │
│   title: "Morning Meditation",           │
│   description: "Start your day...",      │
│   category: "Mindfulness",               │
│   difficulty: "Easy",                    │
│   estimatedTime: 15,                     │
│   steps: [                               │
│     {                                    │
│       stepNumber: 1,                     │
│       title: "Find Your Space",          │
│       description: "Choose a quiet...",  │
│       tips: ["Use cushion", "..."],      │
│       videoUrl: "https://...",           │
│       estimatedDuration: 2               │
│     },                                   │
│     { /* step 2 */ },                    │
│     { /* step 3 */ }                     │
│   ],                                     │
│   materials: ["Cushion", "Timer"],       │
│   benefits: ["Reduces stress", "..."],   │
│   createdAt: Date,                       │
│   updatedAt: Date                        │
│ }                                        │
└─────────────────────────────────────────┘

useractivities Collection:
┌─────────────────────────────────────────┐
│ {                                        │
│   _id: ObjectId("..."),                  │
│   userId: ObjectId("..."),               │
│   activityId: ObjectId("..."),           │
│   status: "pending",                     │
│   progress: {                            │
│     currentStep: 2,                      │
│     completedSteps: [                    │
│       { stepNumber: 1, completedAt },    │
│       { stepNumber: 2, completedAt }     │
│     ],                                   │
│     totalSteps: 3,                       │
│     percentComplete: 66,                 │
│     startedAt: Date                      │
│   },                                     │
│   completedAt: null,                     │
│   createdAt: Date,                       │
│   updatedAt: Date                        │
│ }                                        │
└─────────────────────────────────────────┘

users Collection:
┌─────────────────────────────────────────┐
│ {                                        │
│   _id: ObjectId("..."),                  │
│   username: "user123",                   │
│   password: "hashed_password",           │
│   name: "John Doe",                      │
│   streak: {                              │
│     current: 5,                          │
│     longest: 10,                         │
│     lastActivityDate: Date               │
│   },                                     │
│   badges: ["First Step", "Week Warrior"],│
│   createdAt: Date,                       │
│   updatedAt: Date                        │
│ }                                        │
└─────────────────────────────────────────┘
```

---

## 🎯 Component Interaction Map

```
                    App Root
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Homepage       Activities    Execution
        │              │              │
        ├─ AuthForm    ├─ SearchBar   ├─ Header
        ├─ HeroSection ├─ Filters     ├─ ProgressBar
        └─ Features    ├─ ActivityCard├─ StepCard
                       │  └─ StartBtn  │  ├─ Tips
                       │               │  ├─ Video
                       └─ Pagination   │  └─ CompleteBtn
                                       │
                                       └─ Celebration
```

---

## 📈 Performance Optimization

```
┌──────────────────────────────────────────────┐
│  Optimization Strategy                        │
├──────────────────────────────────────────────┤
│                                               │
│  1. Code Splitting:                           │
│     ├─ Dynamic imports for heavy components  │
│     └─ Route-based code splitting            │
│                                               │
│  2. Image Optimization:                       │
│     ├─ Next.js Image component               │
│     └─ Lazy loading for images               │
│                                               │
│  3. Data Fetching:                            │
│     ├─ Server-side rendering where possible  │
│     ├─ Static generation for public pages    │
│     └─ Client-side for dynamic data          │
│                                               │
│  4. Caching:                                  │
│     ├─ API response caching                  │
│     ├─ Browser caching for static assets     │
│     └─ LocalStorage for user data            │
│                                               │
│  5. Animation Performance:                    │
│     ├─ CSS transforms (GPU-accelerated)      │
│     ├─ RequestAnimationFrame for JS          │
│     └─ Will-change property for transitions  │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 🔍 Testing Strategy

```
┌──────────────────────────────────────────────┐
│  Testing Pyramid                              │
├──────────────────────────────────────────────┤
│                                               │
│           E2E Tests (10%)                     │
│         ┌─────────────┐                      │
│         │ Full flows  │                      │
│         └─────────────┘                      │
│                                               │
│       Integration Tests (30%)                │
│     ┌───────────────────────┐               │
│     │ API + Database        │               │
│     │ Component interaction │               │
│     └───────────────────────┘               │
│                                               │
│      Unit Tests (60%)                        │
│   ┌─────────────────────────────┐           │
│   │ Functions                   │           │
│   │ Components                  │           │
│   │ Utilities                   │           │
│   └─────────────────────────────┘           │
│                                               │
└──────────────────────────────────────────────┘

Key Test Cases:
✓ User can authenticate
✓ Activities load correctly
✓ Filters work as expected
✓ Step completion updates progress
✓ Progress persists across sessions
✓ Celebration shows on completion
✓ Mobile layout is responsive
```

---

*This visual guide provides a comprehensive overview of the system architecture, flows, and interactions in the modernized Daily Activity Tracker.*
