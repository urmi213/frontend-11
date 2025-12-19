import React from 'react';

const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  error,
  required = false,
  minDate = null,
  maxDate = null,
  disabled = false,
  className = '',
  ...props 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate || today}
        max={maxDate}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;