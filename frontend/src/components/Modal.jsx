/**
 * Modal - Reusable modal/dialog component
 * 
 * Usage:
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit Profile"
 * >
 *   <ProfileForm onSuccess={() => setIsOpen(false)} />
 * </Modal>
 */

import { FiX } from 'react-icons/fi';
import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description = null,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  closeButton = true,
  backdrop = true,
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      {backdrop && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modal Container */}
      <div
        className={`relative bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-screen overflow-y-auto`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900"
            >
              {title}
            </h2>
            {description && (
              <p
                id="modal-description"
                className="text-sm text-gray-600 mt-1"
              >
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          {closeButton && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
