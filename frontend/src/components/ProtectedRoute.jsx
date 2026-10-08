/**
 * ProtectedRoute Component - RBAC-enforced route protection
 * Checks both authentication and role-based permissions
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../constants/roles';
import { getUserRole } from '../utils/storage';

/**
 * ProtectedRoute - Protects routes by authentication and role
 *
 * Props:
 * - children: Route component to protect
 * - requiredRole: Single role string or array of allowed roles
 * - requiredPermission: Permission string to check (e.g., 'view_students')
 * - fallback: Component to show while loading
 * - redirectTo: Path to redirect on unauthorized (default: /login)
 */
export default function ProtectedRoute({
  children,
  requiredRole = null,
  requiredPermission = null,
  fallback = null,
  redirectTo = '/login',
}) {
  const { isAuthenticated, userRole, isLoading, user } = useAuth();

  // Show fallback while loading
  if (isLoading) {
    return fallback || <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    // Try context userRole first, fall back to localStorage if context not ready yet (race condition fix)
    const storageRole = getUserRole();
    const effectiveRole = userRole || storageRole;
    const isAllowed = allowedRoles.includes(effectiveRole);
    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if user has required permission
  if (requiredPermission && user) {
    if (!hasPermission(userRole, requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
