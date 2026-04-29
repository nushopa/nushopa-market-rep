import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

interface OAuthButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
  children: React.ReactNode;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick, children }) => {
  const getProviderStyles = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md';
      case 'facebook':
        return 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-md hover:shadow-lg';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm hover:shadow-md';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0
        ${getProviderStyles(provider)}
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 focus:shadow-xl
      `}
    >
      {provider === 'google' && <FcGoogle className="w-5 h-5" />}
      {provider === 'facebook' && <FaFacebookF className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default OAuthButton;