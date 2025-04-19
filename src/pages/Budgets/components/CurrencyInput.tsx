
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
  const [lastValue, setLastValue] = useState<string>(displayValue);
  
  // Update the display value whenever the actual value changes from props
  useEffect(() => {
    const formatted = value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    // Only update if the value has changed from outside
    if (parseFloat(displayValue.replace(/\./g, '').replace(',', '.')) !== value) {
      setDisplayValue(formatted);
      setLastValue(formatted);
    }
  }, [value]);
  
  // Restore cursor position after the input value is updated
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [displayValue, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value and current cursor position
    let inputValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    // Count dots and commas before cursor in old and new values
    const dotsAndCommasBeforeCursorInLast = (lastValue.substring(0, cursorPos).match(/[,\.]/g) || []).length;
    const dotsAndCommasBeforeCursorInNew = (inputValue.substring(0, cursorPos).match(/[,\.]/g) || []).length;
    
    // Find difference in dots/commas to adjust cursor
    const separatorDiff = dotsAndCommasBeforeCursorInNew - dotsAndCommasBeforeCursorInLast;
    
    // If user is trying to input a decimal separator, ensure it's a comma
    if (inputValue.includes('.')) {
      inputValue = inputValue.replace('.', ',');
    }
    
    // Remove anything that's not a digit or comma
    const cleanedValue = inputValue.replace(/[^\d,]/g, '');
    
    // Ensure there's only one comma
    const parts = cleanedValue.split(',');
    let formattedValue = parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    
    // Limit decimal places to 2
    if (parts.length > 1 && parts[1].length > 2) {
      formattedValue = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    // Add thousand separators
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    formattedValue = integerPart + (parts.length > 1 ? ',' + parts[1].substring(0, 2) : '');
    
    // Calculate new cursor position
    let newCursorPos = cursorPos;
    
    // Adjust for thousand separators added/removed
    const oldThousandSeparators = (lastValue.substring(0, cursorPos).match(/\./g) || []).length;
    const newThousandSeparators = (formattedValue.substring(0, cursorPos).match(/\./g) || []).length;
    const thousandSeparatorDiff = newThousandSeparators - oldThousandSeparators;
    
    newCursorPos += thousandSeparatorDiff - separatorDiff;
    
    // Ensure cursor stays within valid range
    newCursorPos = Math.max(0, Math.min(newCursorPos, formattedValue.length));
    
    // Update state
    setDisplayValue(formattedValue);
    setLastValue(formattedValue);
    setCursorPosition(newCursorPos);
    
    // Parse the value to a number for storage
    const numericValue = formattedValue.replace(/\./g, '').replace(',', '.');
    const parsedValue = parseFloat(numericValue);
    
    // If it's a valid number, call the onChange handler
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    } else if (formattedValue === '' || formattedValue === '0' || formattedValue === '0,0' || formattedValue === '0,00') {
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
        setLastValue(formatted);
        onChange(parsedValue);
      } else {
        setDisplayValue('0,00');
        setLastValue('0,00');
        onChange(0);
      }
    } catch (e) {
      setDisplayValue('0,00');
      setLastValue('0,00');
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
