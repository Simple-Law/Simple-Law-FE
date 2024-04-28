import React from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "antd";
import { ReactComponent as Eye } from "assets/images/icons/eye.svg";
import { ReactComponent as Eyeclose } from "assets/images/icons/eyeclose.svg";
import MyButton from "components/MyButton";
import kakao from "assets/images/icons/kakao.svg";
import google from "assets/images/icons/Google.svg";
import naver from "assets/images/icons/naver.svg";
import LoginForm from "components/LoginForm";

const Login = ({ admin }) => {
  const title = admin ? "관리자 로그인" : "로그인";
  return (
    <LoginForm title={title}>
      <div className="gap-10 flex justify-center flex-col">
        <div>
          <Input placeholder="아이디 입력" className=" px-4 py-3" />
          <Input.Password
            className=" px-4 py-3 my-2"
            placeholder="비밀번호 입력"
            iconRender={(visible) => (visible ? <Eye /> : <Eyeclose />)}
          />
          <Button
            type="primary"
            block
            className=" px-4 py-3 h-12 text-base font-medium"
          >
            로그인
          </Button>
        </div>
        <div className="justify-center items-center gap-3 inline-flex w-full">
          <Link
            to="/signup"
            className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
          >
            회원가입
          </Link>
          <div className="w-px h-3 bg-zinc-300"></div>
          <Link
            to="/"
            className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
          >
            아이디 찾기
          </Link>
          <div className="w-px h-3 bg-zinc-300"></div>
          <Link
            to="/"
            className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
          >
            <span>비밀번호 찾기</span>
          </Link>
        </div>
        {!admin && (
          <div class="justify-start items-center inline-flex">
            <div class="grow shrink basis-0 h-px bg-zinc-200"></div>
            <div class="px-3 justify-center items-center gap-2.5 flex">
              <div class="text-center text-neutral-400 text-base font-medium font-['Pretendard'] leading-tight">
                또는
              </div>
            </div>
            <div class="grow shrink basis-0 h-px bg-zinc-200"></div>
          </div>
        )}

        {!admin && (
          <div className="w-full">
            <MyButton
              className="px-4 py-3 h-12 "
              backgroundimage={kakao}
              text="카카오 로그인"
              backgroundcolor={"#FEE502"}
            />
            <MyButton
              className="px-4 py-3 h-12 my-2"
              backgroundimage={naver}
              text="네이버 로그인"
              hasborder={true}
            />
            <MyButton
              className="px-4 py-3 h-12"
              backgroundimage={google}
              text="구글 로그인"
              hasborder={true}
            />
          </div>
        )}
      </div>
    </LoginForm>
  );
};

export default Login;
