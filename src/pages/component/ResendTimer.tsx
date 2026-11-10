import React, { useState, useEffect } from "react";

interface ResendTimerProps {
  seconds?: number;
  onResend: () => void;
  isLoading?: boolean;
}

const ResendTimer: React.FC<ResendTimerProps> = ({
  seconds = 60,
  onResend,
  isLoading = false,
}) => {
  const [timer, setTimer] = useState(seconds);
  const canResend = timer <= 0;

  useEffect(() => {
    if (canResend) return;
    const id = setTimeout(() => setTimer((current) => current - 1), 1000);
    return () => clearTimeout(id);
  }, [canResend, timer]);

  const handleResend = () => {
    if (!canResend || isLoading) return;
    setTimer(seconds);
    onResend();
  };

  return (
    <div className="otp-resend-row">
      Didn't receive a code?{" "}
      {canResend ? (
        <button
          className="otp-resend-btn"
          onClick={handleResend}
          disabled={isLoading}
        >
          Resend code
        </button>
      ) : (
        <span>
          Resend in{" "}
          <span className="otp-timer">
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </span>
        </span>
      )}
    </div>
  );
};

export default ResendTimer;
