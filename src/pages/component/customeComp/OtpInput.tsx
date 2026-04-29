import React, { useRef, useEffect, useCallback } from 'react';

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (code: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  hasError = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Focus first box on mount */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* Re-focus first box when cleared (e.g. on error reset or resend) */
  useEffect(() => {
    if (value.every(d => d === '')) {
      inputRefs.current[0]?.focus();
    }
  }, [value]);

  const focusBox = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const commitOtp = useCallback((next: string[]) => {
    onChange(next);
    if (next.every(d => d !== '') && next.join('').length === length) {
      onComplete?.(next.join(''));
    }
  }, [length, onChange, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    commitOtp(next);
    if (digit) focusBox(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const next = [...value];
    pasted.split('').forEach((ch, i) => {
      if (index + i < length) next[index + i] = ch;
    });
    commitOtp(next);
    focusBox(index + pasted.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value];
        next[index] = '';
        onChange(next);
      } else {
        focusBox(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusBox(index + 1);
    }
  };

  return (
    <div className="otp-row">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={e => handlePaste(e, i)}
          disabled={disabled}
          className={[
            'otp-input',
            digit.length > 0 ? 'otp-filled' : '',
            hasError         ? 'otp-error'  : '',
          ].filter(Boolean).join(' ')}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;