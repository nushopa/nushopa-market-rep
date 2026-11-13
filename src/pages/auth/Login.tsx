import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import AuthLayout from "../component/layout/AuthLayout";
import { InputField } from "../component/customeComp/InputField";
import CustomButton from "../component/CustomButton";
import { useLogin } from "../../hook/useAuth";
import { logoutUser, type AuthResponse } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { normalizeUser } from "../../utils/normalizeUser";

const MARKET_REP_ROLE = 6000;

interface ApiErrorResponse {
  message?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email address.";
    if (!formData.password.trim()) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    login.mutate(formData, {
      onSuccess: async (data: AuthResponse) => {
        const role = data?.user?.role;
        if (role !== MARKET_REP_ROLE) {
          await logoutUser().catch(() => {});
          toast.error(
            "Access denied. This portal is for Market Representatives only.",
          );
          return;
        }
        const normalizedUser = data?.user ? normalizeUser(data.user) : null;
        if (normalizedUser) {
          setUser(normalizedUser);
        }

        toast.success("Login successful!");

        if (normalizedUser?.profile_completed) {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      },
      onError: (err: AxiosError<ApiErrorResponse>) => {
        toast.error(
          err?.response?.data?.message || "Invalid email or password.",
        );
      },
    });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your MarketHub journey"
      buttonText="Sign Up"
      buttonPath="/signup"
      formSide="left"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          required
          error={errors.email}
          disabled={login.isPending}
          autoComplete="email"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
          error={errors.password}
          disabled={login.isPending}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-[#0F8128] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <CustomButton
          type="submit"
          isLoading={login.isPending}
          loadingText="Signing in..."
        >
          Sign In
        </CustomButton>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
