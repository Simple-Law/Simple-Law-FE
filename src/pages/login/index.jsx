import React from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "antd";
import { ReactComponent as Eye } from "assets/images/icons/eye.svg";
import { ReactComponent as Eyeclose } from "assets/images/icons/eyeclose.svg";
import MyButton from "components/MyButton";
import kakao from "assets/images/icons/kakao.svg";
import google from "assets/images/icons/Google.svg";
import naver from "assets/images/icons/naver.svg";
import Logo from "assets/images/icons/Logo.svg";
import styled from "styled-components";

const LI = styled.li`
  & a {
    display: flex;
    margin-right: 10px;
    color: #666;
    font-size: 16px;
    font-weight: 400;
    align-items: center;
  }
  &:not(:last-child) a::after {
    content: "|";
    font-size: 12px;
    margin-left: 12px;
    color: #d9d9d9;
  }
`;

const Login = ({ admin }) => {
  return (
    <div className="pt-[140px] flex flex-col justify-between w-full h-screen">
      <div className="w-[400px] mx-auto text-center">
        <div>
          <img src={Logo} alt="" className="mx-auto w-56" />
        </div>
        <h1 className="text-center text-2xl text-gray-900 font-bold my-6">
          {admin ? "관리자 로그인" : "로그인"}
        </h1>

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

        <ul className="flex items-center my-10 justify-center">
          <LI>
            <Link to="/join">회원가입</Link>
          </LI>
          <LI>
            <Link to="/">아이디 찾기</Link>
          </LI>
          <LI>
            <Link to="/">비밀번호 찾기</Link>
          </LI>
        </ul>
        {!admin && (
          <div>
            <MyButton
              className="px-4 py-3 h-12 "
              backgroundImage={kakao}
              text="카카오 로그인"
              backgroundColor={"#FEE502"}
            />
            <MyButton
              className="px-4 py-3 h-12 my-2 "
              backgroundImage={google}
              text="구글 로그인"
              hasBorder={true}
            />
            <MyButton
              className="px-4 py-3 h-12"
              backgroundImage={naver}
              text="네이버 로그인"
              hasBorder={true}
            />
          </div>
        )}
      </div>
      {!admin && (
        <ul className="flex px-60 py-6">
          <LI>
            <Link to="/">공지사항</Link>
          </LI>
          <LI>
            <Link to="/">이용약관 및 개인정보 보호 방침</Link>
          </LI>
          <LI>
            <Link to="/">고객문의이메일</Link>
          </LI>
          <LI>
            <Link to="/">주소</Link>
          </LI>
          <LI>
            <Link to="/">통신판매업신고번호</Link>
          </LI>
          <LI>
            <Link to="/">사업자 등록번호</Link>
          </LI>
        </ul>
      )}
    </div>
  );
};

export default Login;
