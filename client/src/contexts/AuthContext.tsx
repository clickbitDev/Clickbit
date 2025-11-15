import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

// Types
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  avatar?: string;
  created_at: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<{ user: User }>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};

// Initial state
const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!getUserFromStorage(),
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.user.id.toString());
      
      // Update GA4 User-ID tracking
      if (typeof window.analytics?.setUserId === 'function') {
        window.analytics.setUserId(action.payload.user.id.toString());
      }
      
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Clear GA4 User-ID tracking
      if (typeof window.analytics?.clearUserId === 'function') {
        window.analytics.clearUserId();
      }
      
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = getUserFromStorage();
      

      
      if (token && storedUser) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getCurrentUser();

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.data.user, token },
          });
        } catch (error: any) {
          console.error('Authentication check failed:', error);
          console.error('Error response:', error.response?.data);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
      } else if (token && !storedUser) {
        // Token exists but no user data - try to fetch user data
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getCurrentUser();

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.data.user, token },
          });
        } catch (error: any) {
          console.error('Failed to fetch user data:', error);
          console.error('Error response:', error.response?.data);
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
      } else {
        // No token - user is not authenticated
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Listen for storage changes (e.g., token cleared in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        if (e.key === 'token' && !e.newValue) {
          // Token was removed
          dispatch({ type: 'AUTH_LOGOUT' });
        } else if (e.key === 'user' && !e.newValue) {
          // User data was removed
          dispatch({ type: 'AUTH_LOGOUT' });
        } else if (e.key === 'token' && e.newValue !== state.token) {
          // Token was updated - recheck auth
          const checkAuth = async () => {
            try {
              dispatch({ type: 'AUTH_START' });
              const response = await authAPI.getCurrentUser();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: response.data.data.user, token: e.newValue! },
              });
            } catch (error: any) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
            }
          };
          checkAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.token]);

  // Login function
  const login = async (credentials: any) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      
      // Check if response.data.data exists before destructuring
      if (!response.data || !response.data.data || !response.data.data.user || !response.data.data.token) {
        throw new Error(response.data.message || 'Login response missing user or token data.');
      }

      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
      
      toast.success('Login successful!');
      return { user };
    } catch (error: any) {
      let message = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      
      // Do not log in automatically after registration
      // User needs to verify email first
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Clear any existing errors
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Show success message from server or default
      const successMessage = response?.data?.message || 'Registration successful! Please check your email to verify your account.';
      toast.success(successMessage);
    } catch (error: any) {
      // Handle email already exists error specifically
      if (error.response?.status === 409 && error.response?.data?.error === 'EMAIL_EXISTS') {
        const message = error.response?.data?.message || 'This email address is already registered.';
        dispatch({ type: 'AUTH_FAILURE', payload: message });
        toast.error(message, { duration: 5000 });
      } else {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        // Don't show "verification failed" errors after registration - user will verify via email
        if (!message.toLowerCase().includes('verification failed')) {
          dispatch({ type: 'AUTH_FAILURE', payload: message });
          toast.error(message);
        } else {
          // If it's a verification error, just clear it - registration was successful
          dispatch({ type: 'CLEAR_ERROR' });
        }
      }
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Clear GA4 User-ID tracking
    if (typeof window.analytics?.clearUserId === 'function') {
      window.analytics.clearUserId();
    }
    
    dispatch({ type: 'AUTH_LOGOUT' });
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(data);
      dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user || !state.user.permissions) {
      return false;
    }
    // Admin has all permissions implicitly
    if (state.user.role === 'admin') {
      return true;
    }
    return state.user.permissions.includes(permission);
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 