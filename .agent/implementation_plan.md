# Group Expense Manager - Implementation Plan

## Project Overview
A production-ready full-stack mobile application for managing shared group expenses, similar to MoneyMate but designed for groups (friends, roommates, families, trips, teams).

## Tech Stack

### Frontend (Mobile)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI**: Custom components with Light/Dark mode
- **State Management**: React Context + AsyncStorage for offline support
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios
- **Auth**: Expo Google Auth

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + Google OAuth 2.0
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
group-expense-manager/
├── mobile/                          # React Native app
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── screens/                # App screens
│   │   ├── navigation/             # Navigation setup
│   │   ├── contexts/               # React contexts (Auth, Theme)
│   │   ├── services/               # API services
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Helper functions
│   │   ├── constants/              # App constants
│   │   └── App.tsx                 # Root component
│   ├── assets/                     # Images, fonts
│   ├── app.json                    # Expo config
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                         # Node.js API
│   ├── src/
│   │   ├── models/                 # Mongoose models
│   │   ├── routes/                 # Express routes
│   │   ├── controllers/            # Route controllers
│   │   ├── middleware/             # Custom middleware
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Helper functions
│   │   ├── config/                 # Configuration
│   │   └── server.ts               # Entry point
│   ├── tests/                      # Unit tests
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                        # Setup instructions
```

## Implementation Phases

### Phase 1: Project Setup & Backend Foundation
1. Initialize React Native (Expo) project with TypeScript
2. Initialize Node.js backend with Express + TypeScript
3. Setup MongoDB Atlas connection
4. Configure environment variables
5. Setup basic project structure

### Phase 2: Backend - Authentication & User Management
1. Create User model
2. Implement Google OAuth flow
3. Setup JWT authentication middleware
4. Create auth routes (login, verify, logout)
5. Test authentication flow

### Phase 3: Backend - Core Data Models
1. Create Group model
2. Create Expense model
3. Create Settlement model (derived)
4. Setup MongoDB indexes for performance
5. Add data validation schemas

### Phase 4: Backend - API Endpoints
1. **Auth Routes**
   - POST /api/auth/google - Google OAuth login
   - GET /api/auth/me - Get current user
   - POST /api/auth/logout - Logout

2. **User Routes**
   - GET /api/users/search - Search users by email

3. **Group Routes**
   - POST /api/groups - Create group
   - GET /api/groups - Get user's groups
   - GET /api/groups/:id - Get group details
   - PUT /api/groups/:id - Update group
   - DELETE /api/groups/:id - Delete group
   - POST /api/groups/:id/members - Add member
   - DELETE /api/groups/:id/members/:userId - Remove member

4. **Expense Routes**
   - POST /api/expenses - Add expense/income
   - GET /api/expenses/group/:groupId - Get group expenses
   - GET /api/expenses/group/:groupId/monthly - Get monthly expenses
   - PUT /api/expenses/:id - Update expense
   - DELETE /api/expenses/:id - Delete expense

5. **Settlement Routes**
   - GET /api/settlements/group/:groupId - Calculate settlements
   - GET /api/settlements/group/:groupId/monthly - Monthly settlements

### Phase 5: Backend - Business Logic
1. Expense splitting algorithm (equal split)
2. Monthly aggregation logic
3. Settlement calculation (who owes whom)
4. Balance calculation per user
5. Unit tests for core logic

### Phase 6: Mobile - UI Components
1. Theme Provider (Light/Dark mode)
2. Custom Button component
3. Custom Input component
4. Card components
5. Loading & Empty states
6. Month selector component
7. User avatar component
8. Member list component

### Phase 7: Mobile - Authentication
1. Setup Google Sign-In with Expo
2. Create Auth Context
3. Login Screen UI
4. Token storage (AsyncStorage)
5. Auto-login on app start
6. Logout functionality

### Phase 8: Mobile - Core Screens
1. **Home Screen**
   - List of groups
   - Create group button
   - Empty state

2. **Create/Edit Group Screen**
   - Group name input
   - Add members by email
   - Member list with remove option

3. **Group Dashboard Screen**
   - Group header with members
   - Monthly selector
   - Summary cards (expense, income, net)
   - Navigation to expense list

4. **Expense List Screen**
   - Monthly expense list
   - Filter by type
   - Add expense FAB
   - Expense item cards

5. **Add Expense Screen**
   - Title input
   - Amount input
   - Type selector (Expense/Income)
   - Date picker
   - Split preview
   - Save button

6. **Settlement Screen**
   - Who owes whom list
   - Net balance per user
   - Visual indicators

7. **Profile Screen**
   - User info from Google
   - Theme toggle
   - Logout button

### Phase 9: Mobile - API Integration
1. Setup Axios with interceptors
2. Create API service layer
3. Implement error handling
4. Add loading states
5. Implement retry logic
6. Offline support considerations

### Phase 10: Polish & Optimization
1. Add animations and transitions
2. Implement pull-to-refresh
3. Add haptic feedback
4. Optimize MongoDB queries
5. Add pagination for large lists
6. Performance testing
7. Memory leak checks

### Phase 11: Testing
1. Backend unit tests
   - Expense split logic
   - Monthly aggregation
   - Settlement calculation
2. API endpoint tests
3. Mobile component tests
4. Integration tests
5. Manual testing on Android/iOS

### Phase 12: Documentation & Deployment
1. API documentation
2. Setup instructions (README)
3. Environment variable templates
4. MongoDB Atlas setup guide
5. Google OAuth setup guide
6. Deployment instructions
7. Build Android APK
8. Build iOS IPA (if Mac available)

## Key Features Checklist

### Authentication
- [x] Google OAuth integration
- [x] JWT-based sessions
- [x] Secure token storage
- [x] Auto-login

### Group Management
- [x] Create groups
- [x] Add unlimited members
- [x] Remove members
- [x] Group access control

### Expense Management
- [x] Add expenses
- [x] Add income
- [x] Equal split logic
- [x] Monthly grouping
- [x] Edit/Delete expenses

### Analytics & Insights
- [x] Monthly summaries
- [x] Total expense/income
- [x] Net balance
- [x] Per-user contribution
- [x] Settlement calculation

### UI/UX
- [x] Light/Dark mode
- [x] System theme detection
- [x] Smooth animations
- [x] Loading states
- [x] Empty states
- [x] Error handling

### Performance
- [x] Optimized queries
- [x] Indexed collections
- [x] Pagination
- [x] Caching strategies

## Data Models

### User
```typescript
{
  _id: ObjectId,
  googleId: string,
  name: string,
  email: string,
  avatar: string,
  createdAt: Date
}
```

### Group
```typescript
{
  _id: ObjectId,
  name: string,
  createdBy: ObjectId (User),
  members: ObjectId[] (User),
  createdAt: Date
}
```

### Expense
```typescript
{
  _id: ObjectId,
  groupId: ObjectId (Group),
  addedBy: ObjectId (User),
  title: string,
  amount: number,
  type: 'EXPENSE' | 'INCOME',
  splitType: 'EQUAL',
  date: Date,
  month: number,
  year: number,
  createdAt: Date
}
```

### Settlement (Derived)
```typescript
{
  groupId: ObjectId,
  fromUserId: ObjectId,
  toUserId: ObjectId,
  amount: number
}
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/google | Google OAuth login |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout |
| GET | /api/users/search | Search users by email |
| POST | /api/groups | Create group |
| GET | /api/groups | Get user's groups |
| GET | /api/groups/:id | Get group details |
| PUT | /api/groups/:id | Update group |
| DELETE | /api/groups/:id | Delete group |
| POST | /api/groups/:id/members | Add member |
| DELETE | /api/groups/:id/members/:userId | Remove member |
| POST | /api/expenses | Add expense/income |
| GET | /api/expenses/group/:groupId | Get group expenses |
| GET | /api/expenses/group/:groupId/monthly | Get monthly expenses |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/settlements/group/:groupId | Calculate settlements |
| GET | /api/settlements/group/:groupId/monthly | Monthly settlements |

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
```

### Mobile (.env)
```
API_URL=http://localhost:5000/api
GOOGLE_CLIENT_ID=your-google-client-id
```

## Success Criteria
1. ✅ User can login with Google
2. ✅ User can create groups and add members
3. ✅ User can add expenses/income
4. ✅ Expenses are split equally among members
5. ✅ Monthly view works correctly
6. ✅ Settlement calculation is accurate
7. ✅ Light/Dark mode works
8. ✅ App works on Android and iOS
9. ✅ Backend is secure and scalable
10. ✅ Code is clean and well-documented

## Timeline Estimate
- Phase 1-3: 2 days (Backend setup + Auth)
- Phase 4-5: 3 days (API + Business logic)
- Phase 6-7: 2 days (UI Components + Auth)
- Phase 8-9: 4 days (Screens + Integration)
- Phase 10-11: 2 days (Polish + Testing)
- Phase 12: 1 day (Documentation)

**Total: ~14 days for full implementation**
