export interface FormFieldProps {
  label?: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
