import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL } from '../constants';
import {
  User,
  Group,
  Expense,
  Settlement,
  UserBalance,
  MonthlySummary,
  AuthResponse,
  ApiResponse,
} from '../types';

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error
          throw error.response.data;
        } else if (error.request) {
          // Request made but no response
          throw { success: false, message: 'Network error. Please check your connection.' };
        } else {
          // Something else happened
          throw { success: false, message: error.message };
        }
      }
    );
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  // Auth endpoints
  async googleLogin(idToken: string): Promise<AuthResponse> {
    if (require("../constants").USE_MOCK_API) {
        console.log("Using MOCK API for Login");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Login successful",
                    data: {
                        token: "mock-jwt-token-12345",
                        user: {
                            id: "mock-user-id",
                            googleId: "mock-google-id",
                            email: "demo@example.com",
                            name: "Test User",
                            avatar: "https://ui-avatars.com/api/?name=Test+User&background=6366F1&color=fff",
                            createdAt: new Date().toISOString(),
                        },
                    },
                });
            }, 1000);
        });
    }
    return this.client.post('/auth/google', { idToken });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.client.get('/auth/me');
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.client.post('/auth/logout');
  }

  // User endpoints
  async searchUsers(email: string): Promise<ApiResponse<{ users: User[] }>> {
    return this.client.get('/users/search', { params: { email } });
  }

  // Group endpoints
  async createGroup(name: string): Promise<ApiResponse<{ group: Group }>> {
    return this.client.post('/groups', { name });
  }

  async getUserGroups(): Promise<ApiResponse<{ groups: Group[] }>> {
    return this.client.get('/groups');
  }

  async getGroupById(groupId: string): Promise<ApiResponse<{ group: Group }>> {
    return this.client.get(`/groups/${groupId}`);
  }

  async updateGroup(groupId: string, name: string): Promise<ApiResponse<{ group: Group }>> {
    return this.client.put(`/groups/${groupId}`, { name });
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<null>> {
    return this.client.delete(`/groups/${groupId}`);
  }

  async addMember(groupId: string, email: string): Promise<ApiResponse<{ group: Group }>> {
    return this.client.post(`/groups/${groupId}/members`, { email });
  }

  async removeMember(groupId: string, userId: string): Promise<ApiResponse<{ group: Group }>> {
    return this.client.delete(`/groups/${groupId}/members/${userId}`);
  }

  // Expense endpoints
  async createExpense(data: {
    groupId: string;
    title: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
    date?: string;
  }): Promise<ApiResponse<{ expense: Expense }>> {
    return this.client.post('/expenses', data);
  }

  async getGroupExpenses(groupId: string): Promise<ApiResponse<{ expenses: Expense[] }>> {
    return this.client.get(`/expenses/group/${groupId}`);
  }

  async getMonthlyExpenses(
    groupId: string,
    month?: number,
    year?: number
  ): Promise<ApiResponse<{ expenses: Expense[]; summary: MonthlySummary }>> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return this.client.get(`/expenses/group/${groupId}/monthly`, { params });
  }

  async updateExpense(
    expenseId: string,
    data: {
      title?: string;
      amount?: number;
      type?: 'EXPENSE' | 'INCOME';
      date?: string;
    }
  ): Promise<ApiResponse<{ expense: Expense }>> {
    return this.client.put(`/expenses/${expenseId}`, data);
  }

  async deleteExpense(expenseId: string): Promise<ApiResponse<null>> {
    return this.client.delete(`/expenses/${expenseId}`);
  }

  // Settlement endpoints
  async getSettlements(
    groupId: string,
    month?: number,
    year?: number
  ): Promise<ApiResponse<{ userBalances: UserBalance[]; settlements: Settlement[] }>> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return this.client.get(`/settlements/group/${groupId}`, { params });
  }
}

export const api = new ApiService();
