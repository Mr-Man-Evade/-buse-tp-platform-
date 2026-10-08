/**
 * FormTextarea Component - Textarea with validation
 */

import FormField from './FormField';

export default function FormTextarea({
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  hint,
  rows = 4,
  maxLength,
}) {
  const charCount = value?.length || 0;
  const showCharCount = maxLength && charCount > maxLength * 0.8;

  return (
    <FormField label={label} error={error} touched={touched} required={required} hint={hint}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full border rounded-lg py-2.5 px-3 text-sm font-sans
          transition-colors duration-200
          focus:outline-none focus:ring-2
          resize-vertical
          ${error && touched
            ? 'border-red-300 focus:ring-red-200 bg-red-50'
            : 'border-gray-200 focus:ring-blue-200'
          }
          ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}
        `}
        required={required}
      />
      {showCharCount && maxLength && (
        <p className={`text-xs mt-1 ${charCount >= maxLength ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount} / {maxLength}
        </p>
      )}
    </FormField>
  );
}
