import React, { useState } from 'react';

interface CustomSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: { id: string | number; name: string }[];
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onValueChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.id.toString() === value);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="border rounded-md p-2 cursor-pointer bg-white shadow-sm"
      >
        {selected?.name || placeholder || 'Select...'}
      </div>
      {isOpen && (
        <div className="absolute w-full mt-1 border rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                onValueChange(option.id.toString());
                setIsOpen(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};