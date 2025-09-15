# Team Work Distribution - What To Do Daily Activity App

## Project Scope

**Expected Hours**: 20 hours per person  
**Team Members**: Art, Nut, Krit  
**Grading**: 50 marks total (Code repo: 5, UI: 5, 3 CRUD Models: 30, Deployment: 10)

---


### UI Development

- [ ] Complete homepage layout with navigation
- [ ] Activities browsing page with filtering
- [ ] User dashboard with statistics
- [ ] Profile management interface
- [ ] Responsive design for mobile/desktop
- [ ] Loading states and error handling
- [ ] Clean, consistent styling with Tailwind CSS

### GitHub Contributions

- [ ] Frontend component commits
- [ ] UI/UX improvement commits
- [ ] Responsive design commits
- [ ] Documentation for UI components

---


### Data Models (Required 3 Entities) ✅ COMPLETED

- [x] **User Model**: id, name, email, preferences, created_at
- [x] **Activity Model**: id, title, description, category, difficulty, estimated_time
- [x] **UserActivity Model**: id, userId, activityId, status, completed_at

### Database Setup ✅ COMPLETED

- [x] MongoDB connection utility (src/lib/mongodb.js)
- [x] Database health check endpoint (/api/health)
- [x] Environment variables setup (.env)
- [x] Mock data files for testing (src/data/)

### REST API Endpoints - TO DO

- [ ] **Activities CRUD**: GET, POST, PUT, DELETE /api/activities
- [ ] **Users CRUD**: GET, POST, PUT, DELETE /api/users
- [ ] **UserActivities CRUD**: GET, POST, PUT, DELETE /api/user-activities
- [ ] Replace mock data with real database operations
- [ ] Proper error handling and validation

### GitHub Contributions

- [x] Database connection commits
- [x] Data models commits
- [ ] API route implementation commits
- [ ] Database model commits
- [ ] Data validation commits
- [ ] Backend logic commits

---


### Frontend-Backend Integration

- [ ] Connect all pages to real API endpoints
- [ ] Replace mock data with database data
- [ ] Implement error handling for API calls
- [ ] Add loading states during data fetch
- [ ] Test all CRUD operations work end-to-end

### Deployment & Repository (5 marks)

- [ ] Deploy app to Vercel (production URL)
- [ ] Set up production MongoDB database
- [ ] Configure environment variables
- [ ] Create comprehensive README.md
- [ ] Add project screenshots to README
- [ ] Create 5-minute demo video (YouTube unlisted)

### GitHub Contributions

- [ ] Integration and connection commits
- [ ] Deployment configuration commits
- [ ] Documentation commits
- [ ] Bug fix and testing commits

---

## 📋 **Shared Requirements**

### Professor's Grading Breakdown (50 marks)

- [ ] **Code Repository (5 marks)**: Well-formed README.md with project info, team members, screenshots
- [ ] **Complete UI (5 marks)**: All necessary operations have working interface
- [ ] **3 CRUD Data Models (30 marks)**: User, Activity, UserActivity with full CRUD operations
- [ ] **Deployment (10 marks)**: Working production URL + 5-min demo video

---

## 🎯 **Final Deliverables**

### Required Submissions

- [ ] **Production App**: Working URL (Vercel deployment)
- [ ] **GitHub Repository**: Source code with commit history showing individual contributions
- [ ] **README.md**: Project name, team members (links to their repos), description, screenshots
- [ ] **5-minute Demo Video**: YouTube (unlisted) showing system usage

---

## ✅ **Project Checklist**

### Core Features

- [ ] User registration and profile management
- [ ] Browse activities by category/difficulty
- [ ] Mark activities as completed/skipped/pending
- [ ] User dashboard showing progress and streaks
- [ ] Activity recommendations based on user preferences

### Technical Requirements

- [ ] Next.js frontend (required tech stack)
- [ ] REST API with CRUD operations
- [ ] MongoDB database (no Firebase/managed backend)
- [ ] Responsive design
- [ ] Production deployment

**Goal**: Create a POC-quality project demonstrating full-stack skills with clear individual contributions! 🎯
