/**
 * FormContainer Component - Wrapper for form with title and description
 */

export default function FormContainer({
  title,
  description,
  children,
  onSubmit,
  className = '',
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}
