/**
 * ErrorFallback - User-friendly error display component
 * 
 * Used by ErrorBoundary to show when React errors occur
 */

import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useState } from 'react';

export default function ErrorFallback({ error, errorInfo, onReset }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>

        {/* Error Message (if available) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold text-sm break-words">
              {error.toString()}
            </p>
          </div>
        )}

        {/* Error Details Toggle */}
        {errorInfo && process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showDetails ? 'Hide' : 'Show'} technical details
            </button>

            {showDetails && (
              <details className="mt-3 p-3 bg-gray-100 rounded text-xs text-gray-700 max-h-40 overflow-y-auto font-mono">
                <summary className="font-semibold cursor-pointer mb-2">
                  Stack Trace
                </summary>
                <pre>{errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            Go Home
          </a>
        </div>

        {/* Support Message */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Error ID: {new Date().toISOString()}<br />
          If this keeps happening, please contact{' '}
          <a href="mailto:support@buse.edu.zw" className="text-blue-600 hover:underline">
            support@buse.edu.zw
          </a>
        </p>
      </div>
    </div>
  );
}
