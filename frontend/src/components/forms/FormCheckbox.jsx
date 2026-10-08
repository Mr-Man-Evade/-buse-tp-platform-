/**
 * FormCheckbox Component - Checkbox with label
 */

export default function FormCheckbox({
  name,
  label,
  value,
  onChange,
  error,
  touched,
  disabled,
  hint,
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-4 h-4 rounded border-gray-300
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${error && touched ? 'border-red-300 focus:ring-red-200' : 'focus:ring-blue-200'}
          `}
        />
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      </label>
      
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-1 ml-7">{hint}</p>
      )}
      
      {error && touched && (
        <p className="text-xs text-red-500 mt-1 ml-7">{error}</p>
      )}
    </div>
  );
}
