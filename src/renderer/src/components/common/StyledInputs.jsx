import React from 'react';

// Styled Input component with shadow effects
export const Input = ({ label, type = 'text', value, onChange, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2 bg-gray-900/50 border border-gray-700 
          rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500/50 
          focus:border-purple-500 transition-all duration-200 
          hover:border-purple-400/50 text-white placeholder-gray-400
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

// Styled Button component with shadow effects
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md active:shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white border border-purple-700 hover:border-purple-600',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600 hover:border-gray-500',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-700 hover:border-emerald-600',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-700 hover:border-red-600',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-700 hover:border-blue-600',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Styled Toggle/Switch component
export const Toggle = ({ label, checked, onChange, className = '', ...props }) => {
  return (
    <div className="flex items-center mb-4">
      <label className="inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={onChange}
          className="sr-only peer" 
          {...props}
        />
        <div className="relative w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
        {label && <span className="ms-3 text-sm font-medium text-gray-300">{label}</span>}
      </label>
    </div>
  );
};

// Styled Select component
export const Select = ({ label, value, onChange, options = [], className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full appearance-none px-4 py-2 bg-gray-900/50 border border-gray-700 
            rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500/50 
            focus:border-purple-500 transition-all duration-200 
            hover:border-purple-400/50 text-white ${className}
          `}
          {...props}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Styled Card component with shadow effects
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800 
      shadow-lg hover:shadow-xl transition-all duration-300 
      p-5 relative overflow-hidden ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Styled TabButton component for the tab navigation
export const TabButton = ({ active, children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${active 
          ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md border border-purple-600' 
          : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white shadow-sm border border-gray-700'
        } ${className}
      `}
    >
      {children}
    </button>
  );
};
