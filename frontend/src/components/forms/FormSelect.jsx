/**
 * FormSelect Component - Dropdown select with validation
 */

import FormField from './FormField';

export default function FormSelect({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  hint,
  options = [],
  placeholder,
  icon: Icon,
}) {
  return (
    <FormField label={label} error={error} touched={touched} required={required} hint={hint}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full border rounded-lg py-2.5 px-3 text-sm appearance-none
            transition-colors duration-200
            focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : ''}
            ${error && touched
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : 'border-gray-200 focus:ring-blue-200'
            }
            ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}
          `}
          required={required}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </FormField>
  );
}
