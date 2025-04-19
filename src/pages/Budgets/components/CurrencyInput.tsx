
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
  // Format the initial value to display properly with comma
  const displayValue = value === 0 ? '' : value.toString().replace('.', ',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow any input with digits and only one comma
    const regex = /^[0-9]*,?[0-9]*$/;
    
    if (regex.test(inputValue) || inputValue === '') {
      // Just store the input value as is
      e.target.value = inputValue;
      
      if (inputValue === '') {
        onChange(0);
        return;
      }
      
      if (inputValue === ',') {
        // Allow comma input without conversion
        return;
      }
      
      // Only convert to number when submitting the value
      if (inputValue.includes(',')) {
        const numericValue = parseFloat(inputValue.replace(',', '.'));
        if (!isNaN(numericValue)) {
          onChange(numericValue);
        }
      } else {
        // If no comma, it's a whole number
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
          onChange(numericValue);
        }
      }
    }
  };

  // On blur, ensure the value is properly formatted
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!inputValue || inputValue === '' || inputValue === ',') {
      e.target.value = '';
      onChange(0);
      return;
    }
    
    // Preserve the exact format but store as number
    if (inputValue.includes(',')) {
      const numericValue = parseFloat(inputValue.replace(',', '.'));
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
    } else {
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
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
