/**
 * EmptyState - Displayed when no data exists
 * 
 * Usage:
 * {documents.length === 0 ? (
 *   <EmptyState
 *     icon={FiFile}
 *     title="No documents yet"
 *     description="You haven't uploaded any documents. Upload your first document to get started."
 *     action={{ label: 'Upload Document', onClick: () => navigate('/upload') }}
 *   />
 * ) : (
 *   <DocumentList />
 * )}
 */

import { FiArrowRight } from 'react-icons/fi';

export default function EmptyState({
  icon: Icon,
  title = 'No data',
  description = 'There is nothing to display right now.',
  action = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Icon */}
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
          <FiArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
