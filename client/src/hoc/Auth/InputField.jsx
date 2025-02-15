import React from "react";

export default function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={id}
        className="mb-2 font-bold text-sm text-grey-900 block"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
    </div>
  );
}
