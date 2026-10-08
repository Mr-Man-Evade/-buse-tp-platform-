/**
 * ErrorBoundary - Catches React errors and displays user-friendly message
 * 
 * Usage in App.jsx:
 * <ErrorBoundary>
 *   <Router>
 *     {/* app content */}
 *   </Router>
 * </ErrorBoundary>
 */

import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import ErrorFallback from './ErrorFallback';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error occurs
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log error to console and external service
   */
  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset error state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
