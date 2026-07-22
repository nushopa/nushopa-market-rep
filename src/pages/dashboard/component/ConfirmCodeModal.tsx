import React, { useState, useRef, useCallback } from "react";
import { PiSealCheckFill, PiXCircleFill } from "react-icons/pi";

export interface ConfirmCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  successTitle?: string;
  successDescription?: string;
  successButtonLabel?: string;
  onSuccessClose?: () => void;
  failedTitle?: string;
  failedDescription?: string;
  failedButtonLabel?: string;
}

type ConfirmCodeModalInnerProps = Omit<ConfirmCodeModalProps, "isOpen">;
type Step = "confirm" | "success" | "failed";

const SealCheckIconLarge: React.FC = () => (
  <PiSealCheckFill size={72} color="#16A34A" aria-hidden="true" />
);
const XCircleIconLarge: React.FC = () => (
  <PiXCircleFill size={72} className="text-red-500 shrink-0" aria-hidden="true" />
);
const XCircleIconInline: React.FC = () => (
  <PiXCircleFill size={16} className="text-red-500 shrink-0" aria-hidden="true" />
);

const ConfirmCodeModalInner: React.FC<ConfirmCodeModalInnerProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
  title = "Confirm Delivery Code",
  description = "Enter the confirmation code provided by the customer to complete this delivery.",
  successTitle = "Successful",
  successDescription = "Your action was completed successfully.",
  successButtonLabel = "Done",
  onSuccessClose,
  failedTitle = "Failed",
  failedDescription = "Your action failed, please check your code and try again.",
  failedButtonLabel = "Try Again",
}) => {
  const [step, setStep] = useState<Step>("confirm");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = useRef<number | null>(null);

  const focusInput = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      inputRef.current = node;
      node.focus();
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) window.clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  const busy = isLoading || submitting;

  const triggerShake = () => {
    setShake(true);
    if (shakeTimeoutRef.current) window.clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = window.setTimeout(() => setShake(false), 400);
  };

  const failInline = (message: string) => {
    setLocalError(message);
    triggerShake();
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      failInline("Please enter a confirmation code.");
      return;
    }
    setLocalError(null);
    try {
      setSubmitting(true);
      await onSubmit(code.trim());
      // Reached only if onSubmit resolved WITHOUT throwing.
      setCode("");
      setFailedMessage(null);
      setStep("success");
    } catch (err) {
      // Reached only if onSubmit rejected/threw.
      const message = err instanceof Error && err.message ? err.message : null;
      setFailedMessage(message);
      setStep("failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (localError) setLocalError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSuccessClose = onSuccessClose ?? onClose;
  const handleSuccessBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleSuccessClose();
  };
  const handleSuccessKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") handleSuccessClose();
  };

  const handleRetry = () => {
    setFailedMessage(null);
    setCode("");
    setStep("confirm");
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const handleFailedBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  const handleFailedKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
  };

  // Exactly one of these three renders — switch makes the exclusivity explicit
  // and impossible to accidentally fall through.
  switch (step) {
    case "success":
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={handleSuccessBackdropClick}
          onKeyDown={handleSuccessKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-description"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center space-y-5">
            <SealCheckIconLarge />
            <div className="space-y-1">
              <h2 id="success-modal-title" className="text-xl font-semibold text-gray-900">
                {successTitle}
              </h2>
              <p id="success-modal-description" className="text-sm text-gray-500">
                {successDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSuccessClose}
              autoFocus
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
            >
              {successButtonLabel}
            </button>
          </div>
        </div>
      );

    case "failed":
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={handleFailedBackdropClick}
          onKeyDown={handleFailedKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="failed-modal-title"
          aria-describedby="failed-modal-description"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center space-y-5">
            <XCircleIconLarge />
            <div className="space-y-1">
              <h2 id="failed-modal-title" className="text-xl font-semibold text-gray-900">
                {failedTitle}
              </h2>
              <p id="failed-modal-description" className="text-sm text-gray-500">
                {failedMessage || failedDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              autoFocus
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
            >
              {failedButtonLabel}
            </button>
          </div>
        </div>
      );

    case "confirm":
    default:
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="space-y-1">
              <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <p id="confirm-modal-description" className="text-sm text-gray-500">
                {description}
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-code-input" className="block text-sm font-medium text-gray-700">
                Confirmation Code
              </label>
              <input
                ref={focusInput}
                id="confirm-code-input"
                type="text"
                value={code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 4829"
                disabled={busy}
                aria-invalid={localError ? true : undefined}
                aria-describedby={localError ? "confirm-code-error" : undefined}
                className={[
                  "w-full px-4 py-2.5 rounded-xl border text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-black/20",
                  "transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  localError
                    ? "border-red-400 bg-red-50 placeholder-red-300"
                    : "border-gray-300 bg-gray-50 placeholder-gray-400",
                  shake ? "animate-[shake_0.4s_ease-in-out]" : "",
                ].join(" ")}
              />
              {localError && (
                <p id="confirm-code-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <XCircleIconInline />
                  {localError}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy || !code.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Verifying...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      );
  }
};

const ConfirmCodeModal: React.FC<ConfirmCodeModalProps> = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <ConfirmCodeModalInner key="confirm-code-modal" {...props} />;
};

export default ConfirmCodeModal;