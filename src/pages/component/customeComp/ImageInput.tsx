import React, { useState, useRef } from "react";
import type { FormFieldProps } from "../types";

interface ImageInputProps extends FormFieldProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  previewUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  label: string;
  name: string;
  required: boolean;
  error: string;
  className: string;
  disabled: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label,
  name,
  value,
  onChange,
  previewUrl,
  required = false,
  error,
  className = "",
  disabled = false,
  accept = "image/*",
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAreaClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      onChange?.(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange?.(null);
      setPreview(null);
    }
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent click from bubbling up to the area and reopening picker
    onChange?.(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-black"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Clickable Upload / Preview Area */}
        <div className="flex-1 min-w-0">
          <div
            onClick={handleAreaClick}
            className={`
    relative w-full h-48 rounded-lg border-2 border-dashed transition-all duration-200 bg-transparent
    ${
      preview || value
        ? "border-blue-300"
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
    }
    ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
    ${error ? "border-red-500" : ""}
  `}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  onClick={handleAreaClick}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700 dark:text-black">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs mt-1">
                  PNG, JPG, GIF up to {maxSizeMB}MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          required={required}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ImageInput;
