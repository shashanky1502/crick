import React from 'react';

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CustomCardProps) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: CustomCardProps) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);