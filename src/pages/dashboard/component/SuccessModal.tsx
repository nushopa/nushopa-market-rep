import React from "react";
import { PiSealCheckFill } from "react-icons/pi";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

const SealCheckIcon: React.FC = () => (
  <PiSealCheckFill size={72} color="#16A34A" aria-hidden="true" />
);

const SuccessModal: React.FC<Omit<SuccessModalProps, "isOpen">> = ({
  onClose,
  title = "Successful",
  description = "Your action was completed successfully.",
  buttonLabel = "Done",
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center space-y-5">
        <SealCheckIcon />

        <div className="space-y-1">
          <h2
            id="success-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>
          <p id="success-modal-description" className="text-sm text-gray-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;