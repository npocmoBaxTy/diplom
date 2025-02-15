import React from "react";
import { LuBrainCog } from "react-icons/lu";
import "./Logo.css";

export default function Logo({ mini }) {
  return (
    <div className="logo flex items-center text-[#457f8d] text-4xl">
      {mini ? (
        <>
          <LuBrainCog />
        </>
      ) : (
        <>
          Kn
          <LuBrainCog />
          wL
        </>
      )}
    </div>
  );
}
