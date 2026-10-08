/**
 * useAuth Hook - Easy access to authentication context
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to use auth context
 * Usage: const { user, token, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default useAuth;
