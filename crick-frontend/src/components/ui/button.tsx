import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'destructive';
  className?: string;
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '' 
}: CustomButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};