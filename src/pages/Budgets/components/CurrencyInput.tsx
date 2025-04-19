
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
    const inputValue = e.target.value;
    
    // Allow digits, comma and control the format
    const regex = /^[0-9]*,?[0-9]*$/;
    
    if (regex.test(inputValue) || inputValue === '') {
      // Update the input field directly
      if (inputValue === ',') {
        // If user only entered a comma, allow it but don't convert yet
        e.target.value = inputValue;
        return;
      }
      
      if (inputValue === '') {
        onChange(0);
        return;
      }
      
      // Convert for numeric processing
      const numericValue = inputValue.replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        onChange(parsedValue);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!inputValue || inputValue === '' || inputValue === ',') {
      e.target.value = '';
      onChange(0);
      return;
    }
    
    // Convert comma to period for JavaScript parsing
    const numericValue = inputValue.replace(',', '.');
    const parsedValue = parseFloat(numericValue);
    
    if (!isNaN(parsedValue)) {
      // Format the value with comma as decimal separator
      const formattedValue = parsedValue.toString().replace('.', ',');
      e.target.value = formattedValue;
      onChange(parsedValue);
    } else {
      e.target.value = '';
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
