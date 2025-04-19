
import React, { useState } from 'react';
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
  // Format the initial value to show with proper decimal places
  const [displayValue, setDisplayValue] = useState<string>(
    value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );

  // Update the display value whenever the actual value changes
  React.useEffect(() => {
    setDisplayValue(value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    let inputValue = e.target.value;
    
    // Remove anything that's not a digit, comma, or dot
    inputValue = inputValue.replace(/[^\d,.]/g, '');
    
    // Update the display with the cleaned input
    setDisplayValue(inputValue);
    
    // Parse the value to a number for storage
    // Replace comma with dot for proper JS number parsing
    const numericValue = inputValue.replace(/\./g, '').replace(',', '.');
    const parsedValue = parseFloat(numericValue);
    
    // If it's a valid number, call the onChange handler
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    } else if (inputValue === '' || inputValue === '0' || inputValue === '0,0' || inputValue === '0,00') {
      onChange(0);
    }
  };

  // Handle focus to select all text for easy editing
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // When leaving the input, format the value properly
  const handleBlur = () => {
    // Format the value to ensure it has 2 decimal places
    try {
      const numericValue = displayValue.replace(/\./g, '').replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        setDisplayValue(parsedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } else {
        setDisplayValue('0,00');
        onChange(0);
      }
    } catch (e) {
      setDisplayValue('0,00');
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
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default CurrencyInput;
