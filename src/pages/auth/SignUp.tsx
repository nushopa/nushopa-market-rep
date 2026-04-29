import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../component/layout/AuthLayout";
import { InputField } from "../component/customeComp/InputField";
import OAuthButton from "../component/layout/OAuthButton";
import CustomButton from "../component/CustomButton";
import { useSendSignupOtp, type ApiErrorResponse } from "../../hook/useAuth";
import type { AxiosError } from "axios";

const MARKET_REP_ROLE = 6000;

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const sendOtp = useSendSignupOtp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required.";
    if (!formData.lastName.trim()) next.lastName = "Last name is required.";
    if (!formData.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email address.";
    if (!formData.password.trim()) next.password = "Password is required.";
    else if (formData.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    sendOtp.mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        role: MARKET_REP_ROLE, 
      },
      {
        onSuccess: () => {
          toast.success("OTP sent! Please verify your email.");
          localStorage.setItem("pendingEmail", formData.email);
          navigate("/otp");
        },
        onError: (err: AxiosError<ApiErrorResponse>) => {
          toast.error(
            err?.response?.data?.message ||
              "Registration failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Become a Market Rep"
      subtitle="Create your account and start exploring market opportunities"
      buttonText="Login"
      buttonPath="/"
      formSide="right"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            required
            error={errors.firstName}
            disabled={sendOtp.isPending}
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            required
            error={errors.lastName}
            disabled={sendOtp.isPending}
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          required
          error={errors.email}
          disabled={sendOtp.isPending}
          autoComplete="email"
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="+234 800 000 0000"
          disabled={sendOtp.isPending}
          autoComplete="tel"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          required
          error={errors.password}
          disabled={sendOtp.isPending}
          autoComplete="new-password"
        />

        <CustomButton
          type="submit"
          isLoading={sendOtp.isPending}
          loadingText="Creating Account..."
        >
          Create Account
        </CustomButton>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 bg-white text-gray-400 font-medium tracking-wider">
              or
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <OAuthButton
            provider="google"
            onClick={() => console.log("Google Sign Up")}
          >
            Sign up with Google
          </OAuthButton>
          <OAuthButton
            provider="facebook"
            onClick={() => console.log("Facebook Sign Up")}
          >
            Sign up with Facebook
          </OAuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
