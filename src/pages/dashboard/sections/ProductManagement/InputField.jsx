import React from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => {
  const inputClasses = `w-full px-3 py-2 text-sm rounded-md bg-[#1e2633] text-white border ${
    error ? "border-red-500" : "border-gray-600"
  } focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm text-gray-300 font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        inputMode={type === "number" ? "decimal" : undefined}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
