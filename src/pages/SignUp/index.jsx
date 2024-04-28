import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Checkbox, Button } from "antd";
import MyButton from "components/MyButton";
import kakao from "assets/images/icons/kakao.svg";
import google from "assets/images/icons/Google.svg";
import naver from "assets/images/icons/naver.svg";
import Logo from "assets/images/icons/Logo.svg";
import Quest from "assets/images/icons/quest.svg";
import Lawyer from "assets/images/icons/lawyer.svg";
import styled, { css } from "styled-components";
import LoginForm from "components/LoginForm";

const CheckboxContainer = styled.div`
  border-radius: 8px;
  border: 1px solid #e4e9f1;
  height: 220px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  /* active 상태일 때의 스타일 */
  ${(props) =>
    props.active &&
    css`
      border-radius: 8px;
      border: 3px solid #2e7ff8;
      box-shadow: 0px 1px 16px 0px rgba(46, 127, 248, 0.16);
    `};
  .checkboxWrapper {
    height: 210px;
  }
`;

const Join = () => {
  const navigate = useNavigate();
  const [checkedQuest, setCheckedQuest] = useState(false);
  const [checkedLawyer, setCheckedLawyer] = useState(false);

  const toggleQuest = () => {
    setCheckedQuest(!checkedQuest);
    setCheckedLawyer(false);
  };

  const toggleLawyer = () => {
    setCheckedLawyer(!checkedLawyer);
    setCheckedQuest(false);
    console.log(checkedLawyer);
  };
  const handleSignUp = () => {
    if (checkedQuest) {
      navigate("/signup/quest");
    } else if (checkedLawyer) {
      navigate("/signup/lawyer");
    } else {
      // 체크된 체크박스가 없는 경우에 대한 처리
    }
  };
  return (
    <LoginForm title="회원가입">
      <div className="gap-10 flex justify-center flex-col">
        <div>
          <div className="grid grid-cols-2 gap-x-2">
            <CheckboxContainer active={checkedQuest} onClick={toggleQuest}>
              <div className="checkboxWrapper">
                <Checkbox
                  value="quest"
                  checked={checkedQuest}
                  onChange={toggleQuest}
                  className="mt-[20px] ml-[20px]"
                ></Checkbox>
                <div className="w-[100px] h-[100px] mx-auto py-[20px] px-[20px] rounded-full bg-slate-50">
                  <div className="">
                    <img src={Quest} alt="" className="ml-4" />
                  </div>
                </div>
                <div className="text-center mt-4 text-gray-800 text-lg font-semibold font-['Pretendard'] leading-6">
                  의뢰인
                </div>
              </div>
            </CheckboxContainer>
            <CheckboxContainer active={checkedLawyer} onClick={toggleLawyer}>
              <div className="checkboxWrapper">
                <Checkbox
                  value="lawyer"
                  checked={checkedLawyer}
                  onChange={toggleLawyer}
                  className="mt-[20px] ml-[20px]"
                ></Checkbox>
                <div className="w-[100px] h-[100px] mx-auto py-[20px] px-[20px] rounded-full bg-slate-50">
                  <img src={Lawyer} alt="" />
                </div>
                <div className="text-center mt-4 text-gray-800 text-lg font-semibold font-['Pretendard'] leading-6">
                  <span>변호사</span>
                </div>
              </div>
            </CheckboxContainer>
          </div>
          <Button
            type="primary"
            block
            className=" px-4 py-3 text-base font-medium mt-3"
            disabled={!checkedQuest && !checkedLawyer}
            onClick={handleSignUp}
          >
            아이디로 가입하기
          </Button>
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
      </div>
    </LoginForm>
  );
};

export default Join;
