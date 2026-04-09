import React from "react";

interface InputProps {
  type?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  onChange,
  value,
  placeholder,
}) => {
  return (
    <div className="relative ">
      <img
        src="_magnifying-glass.svg"
        className="absolute left-3 w-6 h-6 top-1"
      />
      <input
        className="w-94.75 h-9 rounded-sm px-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};
