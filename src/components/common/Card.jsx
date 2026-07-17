import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-base font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-xs text-gray-500 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-t border-gray-100 pt-4 mt-4 flex items-center justify-end gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};
