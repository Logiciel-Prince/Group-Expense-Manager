# Group Expense Manager

A production-ready full-stack mobile application for managing shared group expenses, built with React Native (Expo) and Node.js.

## 🎯 Features

### Core Features
- ✅ **Google OAuth Authentication** - Secure login with Gmail accounts
- ✅ **Group Management** - Create unlimited groups, add/remove members
- ✅ **Expense Tracking** - Add expenses and income with automatic equal splitting
- ✅ **Monthly Summaries** - View expenses grouped by month and year
- ✅ **Settlement Calculation** - Automatically calculate who owes whom
- ✅ **Light/Dark Mode** - System-aware theme with manual toggle
- ✅ **Offline Support** - Local data caching with AsyncStorage

### Technical Features
- 📱 **Cross-Platform** - Works on both Android and iOS
- 🔐 **JWT Authentication** - Secure token-based sessions
- 🗄️ **MongoDB Atlas** - Cloud database with optimized queries
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- ⚡ **Performance** - Optimized with proper indexing and caching
- 🧪 **Tested** - Unit tests for critical business logic

---

## 📁 Project Structure

```
group-expense-manager/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # Mongoose models
│   │   ├── controllers/       # Route controllers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   └── server.ts          # Entry point
│   ├── tests/                 # Unit tests
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                     # React Native (Expo) app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # App screens
│   │   ├── navigation/        # Navigation setup
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   └── constants/         # App constants
│   ├── App.tsx                # Root component
│   ├── app.json               # Expo config
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works)
- **Google Cloud Console** account for OAuth
- **Expo CLI** (will be installed automatically)
- **Android Studio** (for Android) or **Xcode** (for iOS)

### 1. Clone the Repository

```bash
cd "d:\Projects\Apps\Group Expense Manager"
```

---

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/group-expense-manager?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS (Add your mobile app URLs)
ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001,http://localhost:19002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

### Step 4: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen
6. Create credentials for:
   - **Web application** (for backend)
   - **Android** (for Android app)
   - **iOS** (for iOS app)
7. Copy the Client IDs and update:
   - `GOOGLE_CLIENT_ID` in backend `.env`
   - `GOOGLE_CLIENT_ID` in mobile `src/constants/index.ts`

### Step 5: Run Backend

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:5000`

### Step 6: Run Tests

```bash
npm test
```

---

## 📱 Mobile App Setup

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

### Step 2: Configure API URL

Edit `mobile/src/constants/index.ts`:

```typescript
export const API_URL = __DEV__
  ? 'http://10.0.2.2:5000/api' // Android emulator
  // ? 'http://localhost:5000/api' // iOS simulator
  : 'https://your-production-api.com/api';

export const GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';
```

**Note:**
- For Android Emulator: Use `10.0.2.2` instead of `localhost`
- For iOS Simulator: Use `localhost`
- For Physical Device: Use your computer's local IP (e.g., `192.168.1.100`)

### Step 3: Run the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

### Step 4: Build for Production

#### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

#### iOS IPA (Requires Mac + Apple Developer Account)

```bash
eas build --platform ios --profile preview
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  googleId: String (unique, indexed),
  name: String,
  email: String (unique, indexed),
  avatar: String,
  createdAt: Date
}
```

### Group Collection
```javascript
{
  _id: ObjectId,
  name: String,
  createdBy: ObjectId (ref: User, indexed),
  members: [ObjectId] (ref: User, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Collection
```javascript
{
  _id: ObjectId,
  groupId: ObjectId (ref: Group, indexed),
  addedBy: ObjectId (ref: User, indexed),
  title: String,
  amount: Number,
  type: 'EXPENSE' | 'INCOME',
  splitType: 'EQUAL',
  date: Date,
  month: Number (1-12),
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Compound Indexes:**
- `{ groupId: 1, month: 1, year: 1 }` - For monthly queries
- `{ groupId: 1, date: -1 }` - For chronological listing

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/search?email=` | Search users by email |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups` | Create group |
| GET | `/api/groups` | Get user's groups |
| GET | `/api/groups/:id` | Get group details |
| PUT | `/api/groups/:id` | Update group |
| DELETE | `/api/groups/:id` | Delete group |
| POST | `/api/groups/:id/members` | Add member |
| DELETE | `/api/groups/:id/members/:userId` | Remove member |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Add expense/income |
| GET | `/api/expenses/group/:groupId` | Get group expenses |
| GET | `/api/expenses/group/:groupId/monthly?month=&year=` | Get monthly expenses |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Settlements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settlements/group/:groupId?month=&year=` | Calculate settlements |

---

## 🎨 App Screens

### 1. Login Screen
- Google Sign-In button
- Feature highlights
- Clean onboarding

### 2. Home Screen
- List of groups
- Create new group button
- Pull to refresh

### 3. Group Dashboard (To be implemented)
- Group name and members
- Monthly selector
- Summary cards (expense, income, net)

### 4. Expense List (To be implemented)
- Monthly expense list
- Add expense FAB
- Filter by type

### 5. Add Expense (To be implemented)
- Title, amount, type
- Date picker
- Split preview

### 6. Settlement Screen (To be implemented)
- Who owes whom
- Net balances
- Clear visualization

### 7. Profile Screen (To be implemented)
- User info
- Theme toggle
- Logout button

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests include:
- Settlement calculation logic
- Expense splitting
- Monthly aggregation

### Mobile Tests

```bash
cd mobile
npm test
```

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password-less login (Google OAuth only)
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation with Joi
- ✅ MongoDB injection prevention
- ✅ Secure token storage (AsyncStorage)

---

## 🚀 Deployment

### Backend Deployment (Recommended: Railway, Render, or Heroku)

#### Using Railway

1. Install Railway CLI
```bash
npm install -g @railway/cli
```

2. Login and deploy
```bash
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard

#### Using Render

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Add environment variables
5. Deploy

### Mobile App Deployment

#### Google Play Store (Android)

1. Build production APK/AAB
```bash
eas build --platform android --profile production
```

2. Follow [Google Play Console](https://play.google.com/console) guidelines

#### Apple App Store (iOS)

1. Build production IPA
```bash
eas build --platform ios --profile production
```

2. Follow [App Store Connect](https://appstoreconnect.apple.com) guidelines

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ALLOWED_ORIGINS=http://localhost:19000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Mobile (src/constants/index.ts)
```typescript
API_URL=http://10.0.2.2:5000/api
GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

**Google OAuth Error**
- Verify Client ID and Secret are correct
- Check if Google+ API is enabled
- Ensure redirect URIs are configured

### Mobile Issues

**Cannot connect to API**
- For Android Emulator: Use `10.0.2.2` instead of `localhost`
- For iOS Simulator: Use `localhost`
- For Physical Device: Use your computer's local IP

**Google Sign-In Not Working**
- Verify Client ID matches platform (Android/iOS)
- Check if SHA-1 fingerprint is added (Android)
- Ensure bundle ID matches (iOS)

---

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Add more features (unequal splits, categories, etc.)
- Improve UI/UX
- Add more tests
- Optimize performance

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

Built with ❤️ using React Native, Node.js, and MongoDB

---

## 🎯 Next Steps

To complete the full implementation, you need to create the remaining screens:

1. **CreateGroupScreen** - Form to create new group
2. **GroupDashboardScreen** - Main group view with monthly summary
3. **ExpenseListScreen** - List of expenses for selected month
4. **AddExpenseScreen** - Form to add expense/income
5. **SettlementScreen** - Who owes whom visualization
6. **ProfileScreen** - User profile and settings

All the infrastructure (API, models, contexts, components) is ready. You just need to build the UI screens following the pattern shown in `HomeScreen.tsx`.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check MongoDB Atlas logs
4. Review Expo logs (`npx expo start`)

---

**Happy Coding! 🚀**
