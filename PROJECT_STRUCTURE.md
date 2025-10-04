# 📐 Project Structure & Component Guide

## 🗂️ Updated File Structure

```
Daily_Activity/
│
├── 📄 package.json
├── 📄 next.config.mjs
├── 📄 tailwind.config.js
├── 📄 seedActivitiesWithSteps.js        # NEW: Seed script with steps
├── 📄 MODERNIZATION_GUIDE.md            # NEW: Full documentation
├── 📄 IMPLEMENTATION_SUMMARY.md         # NEW: Quick reference
│
├── 📁 public/
│   └── (static assets)
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 page.js                   # UPDATED: Modern homepage
│   │   ├── 📄 layout.js
│   │   ├── 📄 globals.css
│   │   │
│   │   ├── 📁 activities/
│   │   │   └── 📄 page.js               # UPDATED: Modern activity browser
│   │   │
│   │   ├── 📁 activity-execute/         # NEW: Step-by-step execution
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.js           # Dynamic route for each activity
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 page.js
│   │   │
│   │   ├── 📁 user-activity/
│   │   │   └── 📄 page.js
│   │   │
│   │   └── 📁 api/
│   │       ├── 📁 activities/
│   │       │   └── 📄 route.js
│   │       ├── 📁 user-activities/
│   │       │   └── 📄 route.js          # UPDATED: Added PATCH method
│   │       └── 📁 auth/
│   │           ├── 📁 login/
│   │           │   └── 📄 route.js
│   │           └── 📁 signup/
│   │               └── 📄 route.js
│   │
│   ├── 📁 models/
│   │   ├── 📄 Activity.js               # UPDATED: Added steps schema
│   │   ├── 📄 UserActivity.js           # UPDATED: Added progress tracking
│   │   └── 📄 User.js
│   │
│   ├── 📁 data/
│   │   ├── 📄 activitiesWithSteps.js    # NEW: Sample activities with steps
│   │   ├── 📄 mockActivities.js
│   │   ├── 📄 mockUserActivities.js
│   │   └── 📄 mockUsers.js
│   │
│   └── 📁 lib/
│       └── 📄 mongodb.js
│
└── 📁 scripts/
    ├── 📄 seedDatabase.js
    └── 📄 clearDatabase.js
```

---

## 🎨 Component Hierarchy

### **Homepage (`/`)**

```
HomePage
├── AnimatedGradientBackground
│   └── FloatingElements (3x)
├── HeroSection
│   ├── Heading
│   ├── FeatureList
│   │   ├── FeatureItem (Step-by-Step)
│   │   ├── FeatureItem (Progress Tracking)
│   │   └── FeatureItem (Personalized)
│   └── VisualElements
└── AuthCard
    ├── FormToggle (Login/Signup)
    ├── AuthForm
    │   ├── NameInput (signup only)
    │   ├── UsernameInput
    │   └── PasswordInput
    └── SubmitButton
```

### **Activities Page (`/activities`)**

```
ActivitiesPage
├── AnimatedBackground
│   └── FloatingBlobs (3x)
├── Header
│   ├── Title & Welcome
│   └── NavigationButtons
│       ├── MyActivitiesButton
│       └── LogoutButton
├── SearchAndFilters
│   ├── SearchBar
│   └── CategoryFilters
│       └── CategoryButton (x8)
└── ActivityGrid
    └── ActivityCard (multiple)
        ├── CategoryBadge
        ├── Title
        ├── Description
        ├── MetaInfo
        │   ├── DifficultyBadge
        │   ├── TimeBadge
        │   └── StepsBadge
        ├── InstructionsPreview
        └── StartButton
```

### **Activity Execution Page (`/activity-execute/[id]`)**

```
ActivityExecutePage
├── AnimatedBackground
│   └── FloatingBlobs (3x)
├── CelebrationOverlay (conditional)
├── Header
│   ├── BackButton
│   └── ActivityInfo
│       ├── CategoryBadge
│       ├── Title & Description
│       ├── DifficultyInfo
│       ├── ProgressBar (if started)
│       │   ├── PercentageLabel
│       │   └── ProgressBarFill
│       └── StartButton (if not started)
└── StepsSection (if started)
    └── StepCard (multiple)
        ├── StepNumber/CheckIcon
        ├── StepContent
        │   ├── Title
        │   ├── Description
        │   ├── TipsSection
        │   │   └── TipItem (multiple)
        │   ├── VideoButton (if URL exists)
        │   ├── DurationLabel
        │   └── CompleteButton
        └── CompletionStatus
```

---

## 🔄 Data Flow

### **Activity Execution Flow**

```
1. User clicks "Start Activity" on Activities Page
   ↓
2. Router navigates to /activity-execute/[activityId]
   ↓
3. Page loads and fetches:
   - Activity details from /api/activities?id=[activityId]
   - User progress from /api/user-activities?activityId=[activityId]
   ↓
4. State initialized:
   - activity (Activity data)
   - userActivity (User's progress)
   - currentStep (Current step number)
   - completedSteps (Set of completed step numbers)
   - isStarted (Boolean)
   ↓
5. User clicks "Start Activity" button
   ↓
6. PATCH request to /api/user-activities
   - Updates: status='pending', progress.startedAt=Date, progress.totalSteps
   ↓
7. Steps become interactive
   ↓
8. User completes a step (clicks "Mark as Complete")
   ↓
9. Local state updates:
   - Add/remove from completedSteps Set
   - Calculate percentComplete
   - Check if all complete
   ↓
10. PATCH request to /api/user-activities
    - Updates: progress.completedSteps, progress.percentComplete, progress.currentStep
    - If all complete: status='completed', completedAt=Date
   ↓
11. Database updated
   ↓
12. UI reflects new state
    - Progress bar animates
    - Step marked with checkmark
    - If complete: Show celebration
```

### **Progress Tracking Data Structure**

```javascript
// In MongoDB (UserActivity document)
{
  userId: ObjectId("..."),
  activityId: ObjectId("..."),
  status: "pending" | "completed",
  progress: {
    currentStep: 2,                    // Current working step
    completedSteps: [                  // Array of completed steps
      { stepNumber: 1, completedAt: Date },
      { stepNumber: 2, completedAt: Date }
    ],
    totalSteps: 3,                     // Total steps in activity
    percentComplete: 66,               // Calculated percentage
    startedAt: Date                    // When user started
  },
  completedAt: Date | null,            // When all steps done
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design Tokens

### **Color Palette**

```javascript
// Category Gradients
const categoryGradients = {
  Creativity:     'from-purple-500 via-pink-500 to-rose-500',
  Mindfulness:    'from-blue-500 via-cyan-500 to-teal-500',
  Productivity:   'from-orange-500 via-amber-500 to-yellow-500',
  Communication:  'from-indigo-500 via-purple-500 to-pink-500',
  Fitness:        'from-green-500 via-emerald-500 to-teal-500',
  Learning:       'from-blue-600 via-indigo-600 to-purple-600',
  Social:         'from-pink-500 via-rose-500 to-red-500',
  'Self-Care':    'from-violet-500 via-purple-500 to-fuchsia-500'
};

// Difficulty Colors
const difficultyColors = {
  Easy:   'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard:   'bg-red-100 text-red-800'
};

// Status Colors
const statusColors = {
  added:      'bg-blue-100 text-blue-800',
  pending:    'bg-yellow-100 text-yellow-800',
  completed:  'bg-green-100 text-green-800',
  skipped:    'bg-gray-100 text-gray-800'
};
```

### **Spacing & Sizing**

```javascript
// Container Widths
maxWidth: {
  activities: '1280px',
  execution: '1024px',
  auth: '448px'
}

// Card Padding
padding: {
  card: '1.5rem',      // p-6
  section: '2rem',     // p-8
  container: '1rem'    // p-4
}

// Border Radius
rounded: {
  card: '1rem',        // rounded-2xl
  button: '0.5rem',    // rounded-lg
  badge: '9999px'      // rounded-full
}

// Shadows
shadow: {
  card: 'shadow-lg',
  cardHover: 'shadow-2xl',
  button: 'shadow-lg'
}
```

### **Typography**

```javascript
// Headings
h1: 'text-4xl md:text-6xl font-bold'
h2: 'text-3xl font-bold'
h3: 'text-2xl font-bold'
h4: 'text-xl font-semibold'

// Body Text
body: 'text-base leading-relaxed'
small: 'text-sm'
tiny: 'text-xs'

// Weights
normal: 'font-normal'
medium: 'font-medium'
semibold: 'font-semibold'
bold: 'font-bold'
```

---

## 🔌 API Endpoints Reference

### **Activities API** (`/api/activities`)

```javascript
// GET - Fetch activities
GET /api/activities
GET /api/activities?id=[activityId]

// Response
{
  activities: [
    {
      _id: "...",
      title: "...",
      description: "...",
      category: "...",
      difficulty: "...",
      estimatedTime: 15,
      steps: [
        {
          stepNumber: 1,
          title: "...",
          description: "...",
          tips: ["...", "..."],
          videoUrl: "...",
          estimatedDuration: 5
        }
      ],
      materials: ["..."],
      benefits: ["..."]
    }
  ]
}
```

### **User Activities API** (`/api/user-activities`)

```javascript
// GET - Fetch user activities
GET /api/user-activities?userId=[userId]
GET /api/user-activities?userId=[userId]&activityId=[activityId]

// POST - Add activity to user
POST /api/user-activities
Body: {
  userId: "...",
  activityId: "...",
  status: "added"
}

// PATCH - Update progress (NEW)
PATCH /api/user-activities
Body: {
  userActivityId: "...",
  updates: {
    "progress.currentStep": 2,
    "progress.completedSteps": [...],
    "progress.percentComplete": 66,
    "status": "pending" | "completed"
  }
}

// DELETE - Remove activity
DELETE /api/user-activities
Body: {
  userActivityId: "..."
}
```

---

## 🎬 Animation Specifications

### **Background Blob Animation**

```css
@keyframes blob {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -50px) scale(1.1); }
  66%  { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
```

### **Gradient Animation**

```css
@keyframes gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
```

### **Float Animation**

```css
@keyframes float {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -30px) scale(1.1); }
  66%  { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}
```

### **Transition Classes**

```css
/* Hover Effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* Transitions */
.transition-all {
  transition: all 0.3s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.duration-300 {
  transition-duration: 300ms;
}
```

---

## 🧩 Reusable Components

### **Progress Bar Component**

```jsx
<div className="w-full bg-gray-200 rounded-full h-4">
  <div
    className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
    style={{ width: `${percentage}%` }}
  >
    {percentage > 10 && (
      <span className="text-xs font-bold text-white px-2">
        {completed}/{total}
      </span>
    )}
  </div>
</div>
```

### **Category Badge Component**

```jsx
<span className={`
  inline-block px-4 py-1 rounded-full text-sm font-bold text-white
  bg-gradient-to-r ${getCategoryGradient(category)}
`}>
  {category}
</span>
```

### **Step Card Component**

```jsx
<div className={`
  bg-white/80 backdrop-blur-sm rounded-xl shadow-lg
  border-2 ${isCompleted ? 'border-green-400' : 'border-gray-200'}
  p-6
`}>
  <div className="flex items-start gap-4">
    {/* Step Number */}
    <div className={`
      w-12 h-12 rounded-full flex items-center justify-center
      font-bold text-lg
      ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
    `}>
      {isCompleted ? '✓' : stepNumber}
    </div>
    
    {/* Step Content */}
    <div className="flex-1">
      {/* Title, Description, Tips, Video, etc. */}
    </div>
  </div>
</div>
```

---

## 📊 State Management

### **Activity Execution Page State**

```javascript
const [activity, setActivity] = useState(null);           // Activity data
const [userActivity, setUserActivity] = useState(null);   // User's progress record
const [currentStep, setCurrentStep] = useState(0);        // Current step number
const [completedSteps, setCompletedSteps] = useState(new Set());  // Set of completed step numbers
const [loading, setLoading] = useState(true);             // Loading state
const [user, setUser] = useState(null);                   // User data
const [showCelebration, setShowCelebration] = useState(false);  // Celebration animation
const [isStarted, setIsStarted] = useState(false);        // Has user started activity
```

### **Activities Page State**

```javascript
const [activities, setActivities] = useState([]);          // All activities
const [loading, setLoading] = useState(true);             // Loading state
const [user, setUser] = useState(null);                   // User data
const [expandedCards, setExpandedCards] = useState(new Set());  // Expanded activity cards
const [selectedCategory, setSelectedCategory] = useState('All');  // Filter category
const [searchQuery, setSearchQuery] = useState('');       // Search term
```

---

## 🎯 Key Functions

### **Progress Calculation**

```javascript
const calculateProgress = (completedSteps, totalSteps) => {
  return Math.round((completedSteps.size / totalSteps) * 100);
};

const allStepsComplete = (completedSteps, totalSteps) => {
  return completedSteps.size === totalSteps;
};
```

### **Step Completion Handler**

```javascript
const handleStepComplete = async (stepNumber) => {
  // Toggle completion
  const newCompleted = new Set(completedSteps);
  if (newCompleted.has(stepNumber)) {
    newCompleted.delete(stepNumber);
  } else {
    newCompleted.add(stepNumber);
  }
  setCompletedSteps(newCompleted);

  // Calculate progress
  const percentComplete = Math.round(
    (newCompleted.size / activity.steps.length) * 100
  );
  const allComplete = newCompleted.size === activity.steps.length;

  // Prepare updates
  const updates = {
    'progress.completedSteps': Array.from(newCompleted).map(num => ({
      stepNumber: num,
      completedAt: new Date()
    })),
    'progress.percentComplete': percentComplete,
    'progress.currentStep': stepNumber
  };

  if (allComplete) {
    updates.status = 'completed';
    updates.completedAt = new Date();
    setShowCelebration(true);
  }

  // Save to database
  await fetch('/api/user-activities', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userActivityId: userActivity._id,
      updates
    })
  });
};
```

### **Category Gradient Resolver**

```javascript
const getCategoryGradient = (category) => {
  const gradients = {
    Creativity: 'from-purple-500 via-pink-500 to-rose-500',
    Mindfulness: 'from-blue-500 via-cyan-500 to-teal-500',
    Productivity: 'from-orange-500 via-amber-500 to-yellow-500',
    Communication: 'from-indigo-500 via-purple-500 to-pink-500',
    Fitness: 'from-green-500 via-emerald-500 to-teal-500',
    Learning: 'from-blue-600 via-indigo-600 to-purple-600',
    Social: 'from-pink-500 via-rose-500 to-red-500',
    'Self-Care': 'from-violet-500 via-purple-500 to-fuchsia-500',
  };
  return gradients[category] || 'from-blue-500 via-purple-500 to-pink-500';
};
```

---

## 🔐 Authentication Flow

```
1. User visits homepage
   ↓
2. Checks localStorage for existing user
   ↓
3. If found: Show "Go to Activities" button
   If not: Show login/signup form
   ↓
4. User submits credentials
   ↓
5. POST to /api/auth/login or /api/auth/signup
   ↓
6. If successful:
   - Receive user data
   - Store in localStorage
   - Navigate to /activities
   ↓
7. All pages check localStorage on mount
   - If no user: Redirect to homepage
   - If user exists: Continue
```

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints used
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large

// Example usage
<div className="
  grid
  grid-cols-1    // Mobile: 1 column
  md:grid-cols-2 // Tablet: 2 columns
  lg:grid-cols-3 // Desktop: 3 columns
  gap-6
">
```

---

## 🎨 Visual Hierarchy

### **Typography Scale**

```
Level 1 (Hero):     text-5xl md:text-6xl (48-60px)
Level 2 (Page):     text-4xl (36px)
Level 3 (Section):  text-3xl (30px)
Level 4 (Card):     text-2xl (24px)
Level 5 (SubHead):  text-xl (20px)
Level 6 (Body):     text-base (16px)
Level 7 (Small):    text-sm (14px)
Level 8 (Tiny):     text-xs (12px)
```

### **Color Hierarchy**

```
Primary:    Blue-600, Purple-600, Pink-600
Secondary:  Gray-600, Gray-700, Gray-800
Success:    Green-500, Green-600
Warning:    Yellow-500, Yellow-600
Error:      Red-500, Red-600
Info:       Blue-500, Cyan-500
```

---

## ✅ Testing Checklist

### **Functionality**

- [ ] Activities load from database
- [ ] Search filters activities correctly
- [ ] Category filters work
- [ ] Activity execution page loads
- [ ] Start button initializes progress
- [ ] Steps can be marked complete
- [ ] Progress bar updates correctly
- [ ] Progress saves to database
- [ ] Celebration shows on completion
- [ ] Video links open correctly

### **Design**

- [ ] Gradients display properly
- [ ] Animations are smooth
- [ ] Hover effects work
- [ ] Colors match category
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Shadows and borders correct
- [ ] Icons and emojis display

### **Responsive**

- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch interactions work
- [ ] Navigation is accessible
- [ ] Content doesn't overflow
- [ ] Images scale properly

---

## 🚀 Deployment Checklist

- [ ] Environment variables set
- [ ] MongoDB connection configured
- [ ] Database seeded with activities
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] Progress tracking saves
- [ ] Mobile experience tested
- [ ] Performance optimized

---

*This structure guide provides a complete reference for understanding and maintaining the modernized Daily Activity Tracker project.*
