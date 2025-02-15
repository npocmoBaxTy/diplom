import React from "react";

export default function Button({ onClick, children, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 text-white font-bold rounded-xl ${className}`}
    >
      {children}
    </button>
  );
}
