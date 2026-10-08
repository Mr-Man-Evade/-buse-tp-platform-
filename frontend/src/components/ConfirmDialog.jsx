/**
 * ConfirmDialog - Confirmation modal for delete/destructive actions
 * 
 * Usage:
 * const [showConfirm, setShowConfirm] = useState(false);
 * 
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="Delete Document?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger"
 *   onConfirm={() => deleteDocument()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */

import Modal from './Modal';
import { FiAlertCircle } from 'react-icons/fi';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary' | 'danger' | 'success'
  isLoading = false,
  icon = FiAlertCircle,
  isDangerous = false, // Shows danger styling
}) {
  const Icon = icon;

  // Color classes for confirm button
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700',
  };

  const iconColorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    danger: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeButton={!isLoading}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColorClasses[confirmVariant]}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 ${variantClasses[confirmVariant]}`}
          >
            {isLoading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
