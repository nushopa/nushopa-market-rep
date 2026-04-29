import React from 'react';
import type { FormFieldProps } from '../types';

interface SelectOption {
  value: string | number;
  label: string;
  name?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

interface SelectInputProps extends FormFieldProps {
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  searchable?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={`
            w-full pl-3 pr-10 py-2 text-sm border rounded-lg appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer'
            }
            ${error 
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100'
            }
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
export type { SelectOption };