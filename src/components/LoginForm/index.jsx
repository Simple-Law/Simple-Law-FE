import React from "react";
import Logo from "assets/images/icons/Logo.svg";

const LoginForm = ({ children, title }) => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center">
      <div className="relative w-[600px] mb-[100px]  mx-auto">
        <div className="w-full relative  mt-[20px]  px-[100px]">
          <div className="mb-6">
            <img src={Logo} alt="" className="mx-auto w-[226px]" />
            <h1 className="text-center text-lg text-gray-400 font-medium mt-4 pb-[20px]">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
