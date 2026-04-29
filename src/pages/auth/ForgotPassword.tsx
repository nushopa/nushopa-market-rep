import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { InputField } from '../component/customeComp/InputField';
import AuthLayout from '../component/layout/AuthLayout';
import CustomButton from '../component/CustomButton';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]         = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success('Reset link sent! Check your inbox.');
      } else {
        toast.error(data?.message || 'Failed to send reset link. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setEmail('');
    setError('');
  };

  return (
    <AuthLayout
      title="Become a Market Rep"
      subtitle="Create your account and start exploring market opportunities"
      buttonText="Login"
      buttonPath="/"
      formSide="center"
    >
      {!submitted ? (
        <>
          <h1 className="centered-heading">
            Forgot your <em>password?</em>
          </h1>
          <p className="centered-subtext">
            No worries — enter the email linked to your account and we'll
            send you a reset link right away.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="john.doe@example.com"
              required
              error={error}
              disabled={isLoading}
              autoComplete="email"
            />

            <CustomButton
              type="submit"
              isLoading={isLoading}
              loadingText="Sending link…"
            >
              Send Reset Link
            </CustomButton>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="otp-success-icon">
            <div className="otp-success-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="centered-heading">Check your inbox</h1>
          <p className="centered-subtext">
            We sent a reset link to{' '}
            <span className="font-semibold text-[#0F8128]">{email}</span>.
            <br />
            Didn't receive it? Check your spam folder.
          </p>
          <CustomButton onClick={handleTryAgain} type="button">
            Try a different email
          </CustomButton>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;