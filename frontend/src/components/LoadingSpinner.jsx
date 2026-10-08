/**
 * LoadingSpinner - Full-page centered loading indicator
 * 
 * Usage:
 * {isLoading ? (
 *   <LoadingSpinner message="Loading documents..." />
 * ) : (
 *   <DocumentList />
 * )}
 */

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"
            style={{
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>

        {/* Message */}
        <p className="text-gray-600 font-medium text-lg mb-2">{message}</p>
        <p className="text-gray-500 text-sm">Please wait...</p>

        {/* CSS Animation */}
        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
