import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FinalStep = ({ type }) => {
  const navigate = useNavigate();

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <div className='w-[460px] flex flex-col gap-8'>
        <div className='h-20 w-20 rounded-[50px] bg-slate-200 mx-auto flex items-center justify-center'>
          <motion.svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
            viewBox='0 0 48 48'
            fill='none'
            initial='hidden'
            animate='visible'
            transition={{ duration: 2 }}
          >
            <motion.path
              d='M20.5 29.2941L34.4903 15.1863C35.1384 14.5327 36.195 14.5327 36.8431 15.1863C37.4836 15.8322 37.4836 16.8737 36.8431 17.5196L20.5 34L11.1569 24.5785C10.5164 23.9326 10.5164 22.8911 11.1569 22.2452C11.805 21.5916 12.8616 21.5916 13.5098 22.2452L20.5 29.2941Z'
              fill='#287FFF'
              variants={pathVariants}
              stroke='#287FFF'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </motion.svg>
        </div>
        <div>
          <h1 className='text-center text-[32px] font-semibold'>회원 가입 신청이 완료되었습니다</h1>
          {type === "lawyer" && (
            <p className='text-center text-[16px] font-normal text-primary leading-[22px] tracking-[-0.32px] bg-gray-50 rounded-lg p-[20px] px-[27px] mt-[60px]'>
              관리자 승인 후, 등록하신 사용자 아이디로 로그인이 가능합니다.
            </p>
          )}
        </div>
        <div>
          <Button block type='primary' className='mb-4' onClick={() => navigate(`/login/${type}`)}>
            로그인
          </Button>
          <Button block onClick={() => navigate("/home")}>
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
