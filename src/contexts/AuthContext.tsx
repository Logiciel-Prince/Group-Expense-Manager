import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.setAuthToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (idToken: string) => {
    try {
      const response = await api.googleLogin(idToken);
      const { token: authToken, user: userData } = response.data;

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);
      api.setAuthToken(authToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
      try {
          // Try to call the logout API endpoint
          await api.logout();
      } catch (error) {
          console.error("Logout API error:", error);
          // Continue with logout even if API call fails
      }

      // Always clear local storage and state
      try {
          await AsyncStorage.multiRemove([
              STORAGE_KEYS.AUTH_TOKEN,
              STORAGE_KEYS.USER_DATA,
          ]);
      } catch (error) {
          console.error("Error clearing storage:", error);
      }

      // Reset state
      setToken(null);
      setUser(null);
      api.setAuthToken(null);

      console.log("User logged out successfully");
  };

  const refreshUser = async () => {
      try {
          const response = await api.getCurrentUser();
          if (response.data?.user) {
              const userData = response.data.user;
              await AsyncStorage.setItem(
                  STORAGE_KEYS.USER_DATA,
                  JSON.stringify(userData)
              );
              setUser(userData);
          }
      } catch (error) {
          console.error("Error refreshing user:", error);
      }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
