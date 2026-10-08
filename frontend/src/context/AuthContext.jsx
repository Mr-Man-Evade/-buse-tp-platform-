/**
 * AuthContext - Global authentication state management
 * Replaces scattered localStorage calls with centralized context
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getToken, setToken, getUser, setUser, getUserRole, setUserRole, clearAuth } from '../utils/storage';

// Create context
export const AuthContext = createContext(null);

/**
 * AuthProvider component - Wraps app with auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [userRole, setUserRoleState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getToken();
        const storedUser = getUser();
        const storedRole = getUserRole();

        if (storedToken && storedUser && storedRole) {
          setTokenState(storedToken);
          setUserState(storedUser);
          setUserRoleState(storedRole);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setError('Failed to restore authentication');
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user - sets token, user data, and role
   */
  const login = useCallback((token, userData, role) => {
    try {
      setToken(token);
      setUser(userData);
      setUserRole(role);

      setTokenState(token);
      setUserState(userData);
      setUserRoleState(role);
      setError(null);

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to login');
      return false;
    }
  }, []);

  /**
   * Logout user - clears all auth data
   */
  const logout = useCallback(() => {
    try {
      clearAuth();
      setTokenState(null);
      setUserState(null);
      setUserRoleState(null);
      setError(null);
      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
      return false;
    }
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUserState(updatedUser);
      return true;
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user');
      return false;
    }
  }, [user]);

  /**
   * Update user role
   */
  const updateUserRole = useCallback((role) => {
    try {
      setUserRole(role);
      setUserRoleState(role);
      setUserState(prev => ({ ...prev, role }));
      return true;
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update role');
      return false;
    }
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = Boolean(token && user && userRole);

  /**
   * Check if user has permission
   */
  const hasRole = useCallback((role) => {
    if (!isAuthenticated) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  }, [isAuthenticated, userRole]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const value = {
    // State
    user,
    token,
    userRole,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    login,
    logout,
    updateUser,
    updateUserRole,
    clearError,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
