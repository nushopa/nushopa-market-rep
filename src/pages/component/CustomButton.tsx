import React from 'react';
 
type AuthButtonVariant = 'primary' | 'ghost';
 
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: AuthButtonVariant;
  fullWidth?: boolean;
}

const CustomButton = ({
  children,
  isLoading = false,
  loadingText,
  variant = 'primary',
  fullWidth = true,
  disabled,
  className = '',
  ...rest
}: AuthButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-4 px-6 py-2.5';
 
  const variants: Record<AuthButtonVariant, string> = {
    primary:
      'bg-[#0F8128] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-green-300/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md',
    ghost:
      'bg-transparent border border-[#0F8128] text-[#0F8128] hover:bg-[#0F8128]/5 active:bg-[#0F8128]/10 focus:ring-green-300/50 disabled:opacity-50 disabled:cursor-not-allowed',
  };
 
  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          {loadingText ?? 'Loading…'}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default CustomButton