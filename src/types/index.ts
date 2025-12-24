export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  createdBy: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export enum ExpenseType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export interface Expense {
  _id: string;
  groupId: string;
  addedBy: User;
  title: string;
  amount: number;
  type: ExpenseType;
  splitType: 'EQUAL';
  date: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settlement {
  from: {
    userId: string;
    name: string;
    avatar: string;
  };
  to: {
    userId: string;
    name: string;
    avatar: string;
  };
  amount: number;
}

export interface UserBalance {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  paid: number;
  share: number;
  balance: number;
}

export interface MonthlySummary {
  totalExpense: number;
  totalIncome: number;
  netAmount: number;
  count: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
