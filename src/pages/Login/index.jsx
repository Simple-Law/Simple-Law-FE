import React from "react";
import { Link, useParams } from "react-router-dom";
import { Input, Button } from "antd";
import LoginForm from "components/LoginForm";
import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";
import SvgKakao from "components/Icons/Kakao";
import SvgNaver from "components/Icons/Naver";
import SvgGoogle from "components/Icons/Google";

const Login = () => {
  const { type } = useParams();
  const isLawyerLogin = type === "lawyer";
  const title = isLawyerLogin ? "변호사 로그인" : "의뢰인 로그인";
  const toggleType = isLawyerLogin ? "quest" : "lawyer";
  const toggleText = isLawyerLogin ? "의뢰인이신가요?" : "변호사이신가요?";

  return (
    <LoginForm title={title}>
      <div className="gap-10 flex justify-center flex-col">
        <div>
          <Input placeholder="아이디 입력" className=" px-4 py-3" />
          <Input.Password
            className=" px-4 py-3 my-2"
            placeholder="비밀번호 입력"
            iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
          />
          <Button type="primary" block className=" px-4 py-3 h-12 text-base font-medium">
            로그인
          </Button>
        </div>
        <div className="justify-center items-center gap-3 inline-flex w-full">
          <Link
            to={`/signup/${type}`}
            className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
          >
            회원가입
          </Link>
          <div className="w-px h-3 bg-zinc-300"></div>
          <Link to="/findId" className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight">
            아이디 찾기
          </Link>
          <div className="w-px h-3 bg-zinc-300"></div>
          <Link to="/" className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight">
            <span>비밀번호 찾기</span>
          </Link>
        </div>

        <div className="justify-start items-center inline-flex">
          <div className="grow shrink basis-0 h-px bg-zinc-200"></div>
          <div className="px-3 justify-center items-center gap-2.5 flex">
            <div className="text-center text-neutral-400 text-base font-medium font-['Pretendard'] leading-tight">
              또는
            </div>
          </div>
          <div className="grow shrink basis-0 h-px bg-zinc-200"></div>
        </div>

        <div className="w-full flex gap-6 justify-center">
          <div className="flex justify-center items-center rounded-[50px] bg-kakaoYellow w-[54px] h-[54px]">
            <SvgKakao width="24px" height="24px" />
          </div>
          <div className="flex justify-center items-center rounded-[50px] bg-naverGreen w-[54px] h-[54px]">
            <SvgNaver width="20px" height="20px" />
          </div>
          <div className="flex justify-center items-center rounded-[50px] border-[1px] w-[54px] h-[54px]">
            <SvgGoogle width="24px" height="24px" fill="#FFF" />
          </div>
        </div>
        <Link to={`/login/${toggleType}`} className="text-base font-normal text-center text-Base-Blue underline">
          {toggleText}
        </Link>
      </div>
    </LoginForm>
  );
};

export default Login;
