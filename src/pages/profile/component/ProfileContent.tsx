import React, { useState } from "react";
import DateInput from "../../component/customeComp/DateInput";
import { InputField } from "../../component/customeComp/InputField";
import ImageInput from "../../component/customeComp/ImageInput";
import SelectInput from "../../component/customeComp/SelectInput";
import { MdEdit } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { updateMarketRepProfile } from "../../../api/authApi";
import type { ProfileFormData, ProfileFormErrors } from "./types";
import { ID_TYPES, NIGERIAN_STATES } from "./data";

const minDOB = "1900-01-01";
const maxDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  .toISOString()
  .split("T")[0];

const ProfileContent = () => {
  const [form, setForm] = useState<ProfileFormData>({
    profilePicture: null,
    dateOfBirth: "",
    city: "",
    address: "",
    state: "",
    idType: "",
    proofOfId: null,
    userName: "John Doe", // Replace with actual user data from your auth store/context
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  

  const getInitials = (): string => {
    if (!form.userName) return "?";
    const names = form.userName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].slice(0, 2).toUpperCase();
  };

  const validate = (): ProfileFormErrors => {
    const e: ProfileFormErrors = {};
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.state) e.state = "State is required.";
    if (!form.idType) e.idType = "Please select an ID type.";
    if (!form.proofOfId) e.proofOfId = "Proof of ID is required.";
    return e;
  };

  const set = <K extends keyof ProfileFormData>(
    key: K,
    val: ProfileFormData[K]
  ) => {
    const errorKey = key as keyof ProfileFormErrors;
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errorKey in errors) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const baseUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

    if (!baseUrl) {
      throw new Error("Cloudinary configuration is missing. Please check your .env file.");
    }
    if (!uploadPreset) {
      throw new Error("VITE_CLOUDINARY_UPLOAD_PRESET is not set in your .env file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "auto"); // Supports image and PDF

    const uploadUrl = `${baseUrl}/image/upload`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = `Upload failed (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error?.message || errorMsg;
      } catch {
        // Ignore JSON parse error
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    return data.secure_url as string;
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (file: File | null) => {
    set("profilePicture", file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validate
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorEl = document.querySelector("[data-error]");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (loading) return;

    setErrors({});
    setLoading(true);
    setApiError("");

    try {
      let profilePictureUrl: string | undefined;
      let proofOfIdUrl: string | undefined;

      // Upload profile picture if provided
      if (form.profilePicture) {
        profilePictureUrl = await uploadFile(form.profilePicture);
      }

      // Upload proof of ID (required)
      if (form.proofOfId) {
        proofOfIdUrl = await uploadFile(form.proofOfId);
      }

      // Send to backend
      await updateMarketRepProfile({
        city: form.city.trim(),
        address: form.address.trim(),
        date_of_birth: form.dateOfBirth,
        state: form.state,
        id_type: form.idType,
        profile_picture: profilePictureUrl,
        proof_of_identity: proofOfIdUrl,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setApiError(errorMessage);

      setTimeout(() => {
        document
          .querySelector("[data-api-error]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
          Profile submitted
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your details are under review. We'll notify you once verified.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Edit profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 px-4">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-semibold">Complete Your Profile</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl mx-auto py-8 px-4 space-y-8"
      >
        {/* Profile Picture Section */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Profile Picture
          </h3>
          <div className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="relative w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden group">
                {form.profilePicture ? (
                  <img
                    src={URL.createObjectURL(form.profilePicture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white drop-shadow-lg">
                      {getInitials()}
                    </span>
                  </div>
                )}

                {/* Edit overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-full">
                  <button
                    type="button"
                    onClick={handleProfilePictureClick}
                    disabled={loading}
                    className="w-11 h-11 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-md border border-white transition-transform hover:scale-110"
                  >
                    <MdEdit className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Click the edit icon to change photo (optional)
              </p>
            </div>

            {errors.profilePicture && (
              <p data-error className="text-sm text-red-600 dark:text-red-400">
                {errors.profilePicture}
              </p>
            )}
          </div>

          {/* Hidden file input for profile picture */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          />
        </section>

        {/* Personal Information */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Personal Information
          </h3>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
            <DateInput
              label="Date of Birth"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={(val) => set("dateOfBirth", val)}
              min={minDOB}
              max={maxDOB}
              placeholder="Select date of birth"
              className="w-full"
              required
              error={errors.dateOfBirth ?? ""}
              disabled={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="City"
                name="city"
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. Lagos"
                required
                error={errors.city}
                disabled={loading}
              />
              <SelectInput
                label="State"
                name="state"
                options={NIGERIAN_STATES}
                value={form.state}
                onChange={(val) => set("state", String(val))}
                placeholder="Select state"
                required
                error={errors.state ?? ""}
                disabled={loading}
              />
            </div>

            <InputField
              label="Address"
              name="address"
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Full street address"
              required
              error={errors.address}
              disabled={loading}
            />
          </div>
        </section>

        {/* Identity Verification */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Identity Verification
          </h3>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a government-issued ID. Your document is kept secure and used only for verification.
            </p>

            <SelectInput
              label="ID Type"
              name="idType"
              options={ID_TYPES}
              value={form.idType}
              onChange={(val) => set("idType", String(val))}
              placeholder="Select ID type"
              required
              error={errors.idType ?? ""}
              disabled={loading}
            />

            <ImageInput
              label="Upload ID Document"
              name="proofOfId"
              value={form.proofOfId}
              onChange={(file) => set("proofOfId", file)}
              error={errors.proofOfId ?? ""}
              accept="image/png,image/jpeg,image/webp,.pdf"
              maxSizeMB={10}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
        </section>

        {/* API Error */}
        {apiError && (
          <div
            data-api-error
            role="alert"
            className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-center"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
          </div>
        )}

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-3"
          >
            <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-1">
              Please fix the following:
            </p>
            <ul className="text-sm text-yellow-600 dark:text-yellow-300 list-disc list-inside space-y-0.5">
              {Object.values(errors).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            All fields marked <span className="text-red-500">*</span> are required.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving Profile...
              </>
            ) : (
              "Submit Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;