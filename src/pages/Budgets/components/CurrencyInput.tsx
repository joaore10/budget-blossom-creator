
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {
  const { value, onChange, className, ...rest } = props;
  const [inputValue, setInputValue] = useState(value === 0 ? '' : value.toFixed(2).replace('.', ','));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^\d,]/g, '');
    setInputValue(newValue);

    if (!newValue || newValue === ',' || newValue === '.') {
      onChange(0);
      return;
    }

    const normalizedValue = newValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    if (!inputValue || inputValue === ',' || inputValue === '.') {
      setInputValue('');
      onChange(0);
      return;
    }

    const normalizedValue = inputValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    if (!isNaN(numericValue)) {
      const formattedValue = numericValue.toFixed(2).replace('.', ',');
      setInputValue(formattedValue);
      onChange(numericValue);
    } else {
      setInputValue(value.toFixed(2).replace('.', ','));
    }
  };

  return (
    <Input
      {...rest}
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default CurrencyInput;
