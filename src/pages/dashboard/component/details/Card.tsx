import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  titleClassName = "mb-3",
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`}
  >
    <h3
      className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${titleClassName}`}
    >
      {title}
    </h3>
    {children}
  </div>
);
