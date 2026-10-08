/**
 * FormField Component - Wrapper for form inputs with label and error display
 */

export default function FormField({
  label,
  error,
  touched,
  required,
  children,
  hint,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
      
      {error && touched && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
