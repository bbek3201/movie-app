"use client";

import React from "react";

interface InputProps {
  type?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  onChange,
  value,
  placeholder,
  className,
}) => {
  return (
    <input
      className={`h-9 rounded-sm px-2
        border border-gray-300 dark:border-gray-500
        bg-white dark:bg-zinc-900
        text-black dark:text-white
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500
        pl-10 transition-colors
        ${className ?? ""}`}
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
};
