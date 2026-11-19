import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputField } from "../component/customeComp/InputField";
import AuthLayout from "../component/layout/AuthLayout";
import CustomButton from "../component/CustomButton";
import { useForgotPassword } from "../../hook/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();

    if (!trimmed) return setError("Please enter your email address.");
    if (!EMAIL_REGEX.test(trimmed))
      return setError("Please enter a valid email address.");

    setError("");

    forgotPassword.mutate(trimmed, {
      onSuccess: () => {
        localStorage.setItem("resetEmail", trimmed);
        toast.success("A reset code has been sent to your email.");
        navigate("/reset-password");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message ||
            "Failed to send reset code. Please try again.",
        );
      },
    });
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="We'll email you a code so you can get back into your account"
      buttonText="Login"
      buttonPath="/"
      formSide="center"
    >
      <h1 className="centered-heading">
        Forgot your <em>password?</em>
      </h1>
      <p className="centered-subtext">
        No worries — enter the email linked to your account and we'll send you a
        verification code right away.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="john.doe@example.com"
          required
          error={error}
          disabled={forgotPassword.isPending}
          autoComplete="email"
        />

        <CustomButton
          type="submit"
          isLoading={forgotPassword.isPending}
          loadingText="Sending code…"
        >
          Send Reset Code
        </CustomButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
