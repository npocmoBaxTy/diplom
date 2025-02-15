import React from "react";
import AuthForm from "./Authform";
import { useAuthLogic } from "./useAuthLogic";

export default function Reg() {
  const { formData, isLoading, handleChange, handleSubmit, isReturningUser } =
    useAuthLogic();

  return (
    <div className="bg-white rounded-lg py-5">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <AuthForm
                formData={formData}
                isLoading={isLoading}
                isReturningUser={isReturningUser}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
