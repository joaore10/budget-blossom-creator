
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
    const inputValue = e.target.value;
    
    // Allow digits and comma
    const regex = /^[0-9]*,?[0-9]*$/;
    
    // Only update if the input matches our pattern or is empty
    if (inputValue === '' || regex.test(inputValue)) {
      e.target.value = inputValue;
      
      if (inputValue && inputValue !== ',') {
        // Convert comma to period for JavaScript parsing
        const numericValue = inputValue.replace(',', '.');
        const parsedValue = parseFloat(numericValue);
        
        if (!isNaN(parsedValue)) {
          onChange(parsedValue);
        }
      } else if (inputValue === '') {
        onChange(0);
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
    
    try {
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
    } catch (e) {
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
