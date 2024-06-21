import React from "react";
import SvgLogo from "components/Icons/Logo";
import { Link } from "react-router-dom";

const LoginForm = ({ children, title }) => {
  return (
    <div className='min-h-screen relative flex flex-col justify-center'>
      <div className='relative w-[600px] mb-[100px]  mx-auto'>
        <div className='w-full relative  mt-[20px]  px-[100px]'>
          <div className='mb-6'>
            <Link to='/'>
              <SvgLogo width='226px' height='58px' className='mx-auto' />
            </Link>
            <h1 className='text-center text-lg text-gray-400 font-medium mt-4 pb-[20px]'>{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
