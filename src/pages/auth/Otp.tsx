import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../component/layout/AuthLayout";
import OtpInput from "../component/customeComp/OtpInput";
import ResendTimer from "../component/ResendTimer";
import { useVerifySignupOtp, useResendOtp } from "../../hook/useAuth";
import { useAuth } from "../../context/AuthContext";
import { normalizeUser } from "../../utils/normalizeUser";

const OTP_LENGTH = 6;

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [hasError, setHasError] = useState(false);

  const verifyOtp = useVerifySignupOtp();
  const resendOtp = useResendOtp();

  // email saved during signup
  const email = localStorage.getItem("pendingEmail") ?? "";

  const handleOtpChange = (next: string[]) => {
    setOtp(next);
    if (hasError) setHasError(false);
  };

  const handleComplete = (code: string) => {
    if (!email) {
      toast.error("Session expired. Please sign up again.");
      navigate("/signup");
      return;
    }

    verifyOtp.mutate(
      { email, otp: code },
      {
        onSuccess: (data) => {
          toast.success("Identity verified!");

          if (data?.token) localStorage.setItem("token", data.token);

          // Write to localStorage AND update context state so isAuthenticated
          // is correct on the very next render (localStorage alone won't
          // trigger a re-render of AuthProvider).
          if (data?.user) {
            setUser(normalizeUser(data.user));
          }

          localStorage.removeItem("pendingEmail");
          navigate("/profile");
        },
        onError: (err) => {
          setHasError(true);
          setOtp(Array(OTP_LENGTH).fill(""));
          toast.error(
            err?.response?.data?.message || "Invalid OTP. Please try again.",
          );
        },
      },
    );
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Session expired. Please sign up again.");
      navigate("/signup");
      return;
    }

    resendOtp.mutate(email, {
      onSuccess: () => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setHasError(false);
        toast.info("A new OTP has been sent to your email.");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message ||
            "Failed to resend OTP. Please try again.",
        );
      },
    });
  };

  const isLoading = verifyOtp.isPending;

  return (
    <AuthLayout
      title="Verify your identity"
      subtitle="Enter the code sent to your registered email to continue"
      buttonText="Login"
      buttonPath="/"
      formSide="center"
    >
      <>
        <h1 className="centered-heading">
          Enter your <em>OTP</em>
        </h1>
        <p className="centered-subtext">
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className="font-medium text-gray-700">
            {email || "your email"}
          </span>
          .
          <br />
          Enter it below to verify your identity.
        </p>

        <OtpInput
          length={OTP_LENGTH}
          value={otp}
          onChange={handleOtpChange}
          onComplete={handleComplete}
          hasError={hasError}
          disabled={isLoading || resendOtp.isPending}
        />

        {isLoading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0F8128] rounded-full animate-spin" />
            Verifying…
          </div>
        )}

        <ResendTimer
          seconds={60}
          onResend={handleResend}
          isLoading={resendOtp.isPending}
        />
      </>
    </AuthLayout>
  );
};

export default OtpPage;