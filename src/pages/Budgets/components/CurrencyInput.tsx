
import React from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  // Format the initial value to display properly
  const displayValue = value === 0 ? '' : value.toString().replace('.', ',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    let inputValue = e.target.value;
    
    // Replace dots with commas for consistency
    inputValue = inputValue.replace('.', ',');
    
    // Allow only digits and commas
    const validInput = inputValue.replace(/[^\d,]/g, '');
    
    // Ensure there's only one comma
    const parts = validInput.split(',');
    const formattedValue = parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    
    // Update the display value directly without parsing
    e.target.value = formattedValue;
    
    // Only convert when we need to update the parent component
    const numericValue = formattedValue.replace(',', '.');
    const parsedValue = parseFloat(numericValue);
    
    // If it's a valid number, call the onChange handler
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    } else if (formattedValue === '') {
      onChange(0);
    }
  };

  // Handle blur to format the value properly when leaving the input
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      e.target.value = '';
      onChange(0);
      return;
    }
    
    try {
      const numericValue = inputValue.replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        // Format with 2 decimal places on blur
        const formatted = parsedValue.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
        e.target.value = formatted;
      } else {
        e.target.value = '';
        onChange(0);
      }
    } catch (e) {
      onChange(0);
    }
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default CurrencyInput;
