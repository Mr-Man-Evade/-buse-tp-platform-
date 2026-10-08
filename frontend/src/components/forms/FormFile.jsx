/**
 * FormFile Component - File input with drag & drop
 */

import { useState } from 'react';
import FormField from './FormField';

export default function FormFile({
  name,
  label,
  value,
  onChange,
  error,
  touched,
  required,
  disabled,
  hint,
  accept,
  multiple = false,
  icon: Icon,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      onChange({
        target: { files, name },
      });
    }
  };

  const handleFileChange = (e) => {
    onChange(e);
  };

  const fileNames = value?.length
    ? Array.from(value)
        .map(f => f.name)
        .join(', ')
    : null;

  return (
    <FormField label={label} error={error} touched={touched} required={required} hint={hint}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          transition-colors duration-200 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : error && touched
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          className="hidden"
          id={`file-input-${name}`}
          required={required}
        />
        
        <label htmlFor={`file-input-${name}`} className="cursor-pointer">
          {Icon && (
            <Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          )}
          <p className="text-sm font-semibold text-gray-700">
            Click to upload {multiple ? 'files' : 'a file'}
          </p>
          <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
          {accept && (
            <p className="text-xs text-gray-400 mt-2">{accept}</p>
          )}
        </label>

        {fileNames && (
          <div className="mt-3 text-xs text-gray-600">
            <p className="font-medium">Selected:</p>
            <p className="break-words">{fileNames}</p>
          </div>
        )}
      </div>
    </FormField>
  );
}
