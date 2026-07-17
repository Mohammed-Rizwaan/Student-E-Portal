import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold leading-5';
  
  const variants = {
    neutral: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-50 text-blue-700 border border-blue-100',
    success: 'bg-green-50 text-green-700 border border-green-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-sky-50 text-sky-700 border border-sky-100'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};
