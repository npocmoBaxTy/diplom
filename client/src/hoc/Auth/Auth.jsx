import React from "react";
import AuthForm from "./AuthForm";
import "./Auth.css";

export default function Auth() {
  return (
    <div className="Auth w-3/6 mx-auto">
      <div className="container flex flex-col w-full mx-auto bg-white rounded-lg my-5">
        <AuthForm />
      </div>
    </div>
  );
}
