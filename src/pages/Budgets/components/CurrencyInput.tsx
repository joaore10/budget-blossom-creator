
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
    
    // Allow only digits and a single comma
    const cleanedInput = inputValue.replace(/[^\d,]/g, '');
    
    // Ensure there's only one comma
    const parts = cleanedInput.split(',');
    let formattedValue = parts[0];
    
    if (parts.length > 1) {
      formattedValue += ',' + parts[1];
    }
    
    // Update the input field with the formatted value
    e.target.value = formattedValue;
    
    // Convert to number for the parent component (only if valid)
    if (formattedValue) {
      const numericValue = formattedValue.replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        onChange(parsedValue);
      }
    } else {
      onChange(0);
    }
  };

  // Handle blur to format the value properly when leaving the input
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!inputValue || inputValue === '') {
      e.target.value = '';
      onChange(0);
      return;
    }
    
    try {
      // Replace comma with period for JS number parsing
      const numericValue = inputValue.replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        // Just keep the value as is, with comma as decimal separator if present
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
