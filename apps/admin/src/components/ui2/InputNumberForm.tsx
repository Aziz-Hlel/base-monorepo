import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';

interface InputNumberFormProps<T extends Object> {
  field: ControllerRenderProps<T>;
  placeholder?: string;
  emptyInitially?: boolean;
}
const InputNumberForm = <T extends Object>({ field, placeholder, emptyInitially = false }: InputNumberFormProps<T>) => {
  const [value, setValue] = useState<string>(emptyInitially ? '' : (field.value as string));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setValue(value);
      field.onChange(value === '' ? undefined : Number(value));
    }
  };

  return (
    <>
      <Input
        placeholder={placeholder}
        type="text"
        pattern="^[0-9]+$"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
      />
    </>
  );
};

export default InputNumberForm;
