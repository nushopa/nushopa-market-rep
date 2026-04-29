import React from 'react';
import type { FormFieldProps } from '../types';

interface DateInputProps extends FormFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  min?: string;
  max?: string;
  label: string;
  name: string;
  required: boolean;
  error: string;
  className: string;
  disabled: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  className = '',
  disabled = false,
  min,
  max,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type="date"
          value={value || ''}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full pl-10 pr-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'hover:border-gray-400 dark:hover:border-gray-600'
            }
            ${error 
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }
          `}
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateInput;