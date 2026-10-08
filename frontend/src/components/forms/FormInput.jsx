/**
 * FormInput Component - Text/email/password input with validation
 */

import FormField from './FormField';

export default function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  icon: Icon,
  hint,
  maxLength,
}) {
  return (
    <FormField label={label} error={error} touched={touched} required={required} hint={hint}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            w-full border rounded-lg py-2.5 px-3 text-sm
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
        />
      </div>
    </FormField>
  );
}
