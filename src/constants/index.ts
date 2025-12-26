// API Base URL
export const API_URL = __DEV__
    ? "http://10.0.2.2:5000" // Android emulator (10.0.2.2 = your computer's localhost)
    : "https://your-production-api.com";

// Google OAuth Client IDs
// TODO: Replace these with your actual Client IDs from Google Cloud Console
export const GOOGLE_CLIENT_ID = {
  web: "84161102992-4tsjoqjtkbh1tio43ob0queft4liakmi.apps.googleusercontent.com", // For Expo Go & Web
  android: "84161102992-lu82fpnllvugb4v6se8tsbponpflvf4u.apps.googleusercontent.com", // Replace with Android Client ID
  ios: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com", // Replace with iOS Client ID
};

export const EXPO_USERNAME = "princedev005";

export const REDIRECT_URI = `https://auth.expo.io/@${EXPO_USERNAME}/group-expense-manager`;

// Feature Flags
export const USE_MOCK_API = true; // Set to true to bypass backend

// AsyncStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  THEME: '@theme',
  EXPO_USERNAME: '@expo_username',
};

// Theme Colors
export const COLORS = {
  light: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    expense: '#EF4444',
    income: '#10B981',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    expense: '#F87171',
    income: '#34D399',
    card: '#1F2937',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Font Sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Font Weights
export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Months
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Short Months
export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
