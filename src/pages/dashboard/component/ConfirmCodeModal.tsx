import React, { useState, useRef, useCallback } from "react";
import SuccessModal from "./SuccessModal";

export interface ConfirmCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Return true when the code is correct, false (or throw) when it isn't.
  // The modal waits for this before deciding what to show next.
  onSubmit: (code: string) => boolean | Promise<boolean>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  externalError?: string | null;
  // Copy shown on the built-in success screen after a correct code.
  successTitle?: string;
  successDescription?: string;
  successButtonLabel?: string;
}

interface ConfirmCodeModalInnerProps {
  onClose: () => void;
  onSubmit: (code: string) => boolean | Promise<boolean>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  externalError?: string | null;
  successTitle?: string;
  successDescription?: string;
  successButtonLabel?: string;
}

const ConfirmCodeModalInner: React.FC<ConfirmCodeModalInnerProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
  title = "Confirm Delivery Code",
  description = "Enter the confirmation code provided by the customer to complete this delivery.",
  externalError = null,
  successTitle = "Successful",
  successDescription = "The delivery code was confirmed successfully.",
  successButtonLabel = "Done",
}) => {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"code" | "success">("code");

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      inputRef.current = node;
      node.focus();
    }
  }, []);

  const displayError: string | null = externalError ?? localError;
  const busy = isLoading || isSubmitting;

  const handleSubmit = async () => {
    if (!code.trim()) {
      setLocalError("Please enter a confirmation code.");
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);

    try {
      const isCorrect = await onSubmit(code.trim());
      if (isCorrect) {
        setCode("");
        setStep("success");
      } else {
        setLocalError("That code doesn't match. Please try again.");
      }
    } catch {
      setLocalError("Something went wrong verifying the code. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  if (step === "success") {
    return (
      <SuccessModal
        isOpen
        onClose={onClose}
        title={successTitle}
        description={successDescription}
        buttonLabel={successButtonLabel}
      />
    );
  }

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
          <h2
            id="confirm-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>
          <p id="confirm-modal-description" className="text-sm text-gray-500">
            {description}
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirm-code-input"
            className="block text-sm font-medium text-gray-700"
          >
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
            aria-invalid={displayError ? true : undefined}
            aria-describedby={displayError ? "confirm-code-error" : undefined}
            className={[
              "w-full px-4 py-2.5 rounded-xl border text-sm",
              "focus:outline-none focus:ring-2 focus:ring-black/20",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              displayError
                ? "border-red-400 bg-red-50 placeholder-red-300"
                : "border-gray-300 bg-gray-50 placeholder-gray-400",
            ].join(" ")}
          />
          {displayError && (
            <p
              id="confirm-code-error"
              role="alert"
              className="text-xs text-red-500 mt-1"
            >
              {displayError}
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
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
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
};

const ConfirmCodeModal: React.FC<ConfirmCodeModalProps> = ({
  isOpen,
  ...props
}) => {
  if (!isOpen) return null;
  return <ConfirmCodeModalInner key="confirm-code-modal" {...props} />;
};

export default ConfirmCodeModal;