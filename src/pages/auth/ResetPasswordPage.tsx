import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../component/layout/AuthLayout";
import OtpInput from "../component/customeComp/OtpInput";
import ResendTimer from "../component/ResendTimer";
import { InputField } from "../component/customeComp/InputField";
import CustomButton from "../component/CustomButton";
import {
  useForgotPassword,
  useVerifyResetCode,
  useUpdatePassword,
} from "../../hook/useAuth";

const OTP_LENGTH = 6;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail") ?? "";

  const [step, setStep] = useState<"code" | "password">("code");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifiedCode, setVerifiedCode] = useState("");
  const [hasError, setHasError] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {},
  );

  const resend = useForgotPassword();
  const verifyCode = useVerifyResetCode();
  const updatePassword = useUpdatePassword();

  const sessionExpired = () => {
    toast.error("Session expired. Please start again.");
    navigate("/forgot-password");
  };

  const handleComplete = (code: string) => {
    if (!email) return sessionExpired();

    verifyCode.mutate(
      { email, code },
      {
        onSuccess: () => {
          setVerifiedCode(code);
          setStep("password");
          toast.success("Code verified. Set your new password.");
        },
        onError: (err) => {
          setHasError(true);
          setOtp(Array(OTP_LENGTH).fill(""));
          toast.error(
            err?.response?.data?.message || "Invalid or expired code.",
          );
        },
      },
    );
  };

  const handleResend = () => {
    if (!email) return sessionExpired();

    resend.mutate(email, {
      onSuccess: () => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setHasError(false);
        toast.info("A new code has been sent to your email.");
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Failed to resend code."),
    });
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return sessionExpired();

    const next: typeof errors = {};
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    updatePassword.mutate(
      { email, password, code: verifiedCode },
      {
        onSuccess: () => {
          localStorage.removeItem("resetEmail");
          toast.success("Password updated. Please log in.");
          navigate("/");
        },
        onError: (err) =>
          toast.error(
            err?.response?.data?.message || "Failed to update password.",
          ),
      },
    );
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Verify your email, then choose a new password"
      buttonText="Login"
      buttonPath="/"
      formSide="center"
    >
      {step === "code" ? (
        <>
          <h1 className="centered-heading">
            Enter your <em>code</em>
          </h1>
          <p className="centered-subtext">
            We sent a {OTP_LENGTH}-digit code to{" "}
            <span className="font-medium text-gray-700">
              {email || "your email"}
            </span>
            .
          </p>

          <OtpInput
            length={OTP_LENGTH}
            value={otp}
            onChange={(next) => {
              setOtp(next);
              if (hasError) setHasError(false);
            }}
            onComplete={handleComplete}
            hasError={hasError}
            disabled={verifyCode.isPending || resend.isPending}
          />

          <ResendTimer
            seconds={60}
            onResend={handleResend}
            isLoading={resend.isPending}
          />
        </>
      ) : (
        <>
          <h1 className="centered-heading">
            Create a <em>new password</em>
          </h1>

          <form
            onSubmit={handleSubmitPassword}
            className="space-y-4"
            noValidate
          >
            <InputField
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              error={errors.password}
              disabled={updatePassword.isPending}
              autoComplete="new-password"
              required
            />
            <InputField
              label="Confirm Password"
              name="confirm"
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors((p) => ({ ...p, confirm: undefined }));
              }}
              error={errors.confirm}
              disabled={updatePassword.isPending}
              autoComplete="new-password"
              required
            />
            <CustomButton
              type="submit"
              isLoading={updatePassword.isPending}
              loadingText="Updating…"
            >
              Update Password
            </CustomButton>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
