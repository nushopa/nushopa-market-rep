import React, { useState } from "react";
import DateInput from "../../component/customeComp/DateInput";
import { InputField } from "../../component/customeComp/InputField";
import ImageInput from "../../component/customeComp/ImageInput";
import SelectInput from "../../component/customeComp/SelectInput";
import { updateMarketRepProfile } from "../../../api/authApi";
import type { ProfileFormData, ProfileFormErrors } from "./types";
import { ID_TYPES, NIGERIAN_STATES } from "./data";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../dashboard/component/UserLayout";
import { useAuth } from "../../../context/AuthContext";
import { normalizeUser } from "../../../utils/normalizeUser";

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
    userName: "John Doe",
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { setUser } = useAuth();

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

  const isFormComplete = (): boolean => {
    return (
      !!form.dateOfBirth &&
      !!form.city.trim() &&
      !!form.address.trim() &&
      !!form.state &&
      !!form.idType &&
      !!form.proofOfId
    );
  };

  const formComplete = isFormComplete();

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


  const handleImageChange = (file: File | null) => {
    set("profilePicture", file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      const response = await updateMarketRepProfile({
        city: form.city.trim(),
        address: form.address.trim(),
        date_of_birth: form.dateOfBirth,
        state: form.state,
        id_type: form.idType,
        profile_picture: profilePictureUrl,
        proof_of_identity: proofOfIdUrl,
      });

      if (response?.profile) {
        setUser(normalizeUser(response.profile));
      }

      navigate("/dashboard", { replace: true });
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


  return (
    <div className="max-w-3xl mx-auto py-4 px-4">
     

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
            <div className="flex flex-col items-center mb-4">
  <div className="relative group inline-block">
    <UserLayout
    showName
      onSettings={() => navigate("/settings")}
      size="lg" 
    />
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
          <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
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
          <h3 className="text-xs font-semibold tracking-widest text-black uppercase">
            Identity Verification
          </h3>
          <div className="bg-white  border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
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
              className="w-full bg wi"
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
            disabled={loading || !formComplete}
            title={!formComplete ? "Fill in all required fields to submit" : undefined}
            className="bg-[#0F8128] text-white  text-sm font-medium px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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