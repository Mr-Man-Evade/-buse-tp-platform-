/**
 * Unauthorized Page - Shows when user lacks permission
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DASHBOARDS } from '../constants/routes';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleGoBack = () => {
    // Redirect to user's default dashboard
    const dashboard = ROLE_DASHBOARDS[userRole] || '/dashboard';
    navigate(dashboard, { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4">
        {/* Icon */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h1>

        {/* Message */}
        <p className="mt-2 text-lg text-gray-600">
          You do not have permission to access this resource.
        </p>

        {/* Additional info */}
        <p className="mt-2 text-sm text-gray-500">
          Your current role does not grant access to this page. If you believe this is an error,
          please contact an administrator.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
