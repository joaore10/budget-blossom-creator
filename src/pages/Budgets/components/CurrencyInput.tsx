
import React, { useState, useRef, useEffect } from 'react';
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  // Update the display value whenever the actual value changes from props
  useEffect(() => {
    const formatted = value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    // Only update if the value has changed from outside
    if (parseFloat(displayValue.replace(/\./g, '').replace(',', '.')) !== value) {
      setDisplayValue(formatted);
    }
  }, [value]);
  
  // Restore cursor position after the input value is updated
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [displayValue, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store cursor position before we modify the string
    const cursorPos = e.target.selectionStart;
    
    // Get the raw input value
    let inputValue = e.target.value;
    
    // If user is trying to input a decimal separator, ensure it's a comma
    if (inputValue.includes('.')) {
      inputValue = inputValue.replace('.', ',');
    }
    
    // Remove anything that's not a digit or comma
    inputValue = inputValue.replace(/[^\d,]/g, '');
    
    // Ensure there's only one comma
    const parts = inputValue.split(',');
    if (parts.length > 2) {
      inputValue = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      inputValue = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    // Calculate new cursor position based on changes
    let newCursorPos = cursorPos;
    if (e.target.value.length > inputValue.length && cursorPos) {
      // If characters were removed, adjust cursor position
      newCursorPos = Math.max(0, cursorPos - (e.target.value.length - inputValue.length));
    }
    
    // Update the display with the cleaned input
    setDisplayValue(inputValue);
    setCursorPosition(newCursorPos);
    
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
    try {
      const numericValue = displayValue.replace(/\./g, '').replace(',', '.');
      const parsedValue = parseFloat(numericValue);
      
      if (!isNaN(parsedValue)) {
        const formatted = parsedValue.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
        setDisplayValue(formatted);
        onChange(parsedValue);
      } else {
        setDisplayValue('0,00');
        onChange(0);
      }
    } catch (e) {
      setDisplayValue('0,00');
      onChange(0);
    }
    
    // Reset cursor position tracking when input loses focus
    setCursorPosition(null);
  };

  return (
    <Input
      {...props}
      ref={inputRef}
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
