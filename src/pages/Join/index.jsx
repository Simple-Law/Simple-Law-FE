import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Button, AutoComplete } from "antd";
import MyButton from "components/MyButton";
import kakao from "assets/images/icons/kakao.svg";
import google from "assets/images/icons/Google.svg";
import naver from "assets/images/icons/naver.svg";
import Logo from "assets/images/icons/Logo.svg";
import Quest from "assets/images/icons/quest.svg";
import Lawyer from "assets/images/icons/lawyer.svg";
import styled, { css } from "styled-components";

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
  const [checkedQuest, setCheckedQuest] = useState(false);
  const [checkedLawyer, setCheckedLawyer] = useState(false);

  // const onChangeQuest = (e) => {
  //   setCheckedQuest(e.target.checked);
  //   setCheckedLawyer(false);
  // };

  // const onChangeLawyer = (e) => {
  //   setCheckedLawyer(e.target.checked);
  //   setCheckedQuest(false);
  // };
  const toggleQuest = () => {
    setCheckedQuest(!checkedQuest);
    setCheckedLawyer(false);
  };

  const toggleLawyer = () => {
    setCheckedLawyer(!checkedLawyer);
    setCheckedQuest(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="relative w-[600px] mb-[100px] pt-[120px] mx-auto">
        <div className="w-full relative  mt-[20px]  px-[100px]">
          <div className="mb-6">
            <img src={Logo} alt="" className="mx-auto w-56" />
            <h1 className="text-center text-2xl text-gray-900 font-bold mt-4 pb-[20px]">
              회원가입
            </h1>
          </div>
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
                    <div class="text-center mt-4 text-gray-800 text-lg font-semibold font-['Pretendard'] leading-6">
                      의뢰인
                    </div>
                  </div>
                </CheckboxContainer>
                <CheckboxContainer
                  active={checkedLawyer}
                  onChange={toggleLawyer}
                >
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
                    <div class="text-center mt-4 text-gray-800 text-lg font-semibold font-['Pretendard'] leading-6">
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
              >
                아이디로 가입하기
              </Button>
            </div>
            <div class="justify-start items-center inline-flex">
              <div class="grow shrink basis-0 h-px bg-zinc-200"></div>
              <div class="px-3 justify-center items-center gap-2.5 flex">
                <div class="text-center text-neutral-400 text-base font-medium font-['Pretendard'] leading-tight">
                  또는
                </div>
              </div>
              <div class="grow shrink basis-0 h-px bg-zinc-200"></div>
            </div>

            <div className="w-full">
              <MyButton
                className="px-4 py-3 h-12 "
                backgroundImage={kakao}
                text="카카오 로그인"
                backgroundColor={"#FEE502"}
              />
              <MyButton
                className="px-4 py-3 h-12 my-2"
                backgroundImage={naver}
                text="네이버 로그인"
                hasBorder={true}
              />
              <MyButton
                className="px-4 py-3 h-12"
                backgroundImage={google}
                text="구글 로그인"
                hasBorder={true}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="min-w-[890px] absolute bottom-0  left-0  flex justify-center items-center bg-white w-full p-[24px]">
        <div class="min-w-[890px] ml-[240px] w-full">
          <div class="w-full items-center gap-4 inline-flex">
            <div class="text-slate-400 text-sm font-normal font-['Pretendard']">
              공지사항
            </div>
            <div class="w-px h-2.5 bg-zinc-200"></div>
            <div class="text-slate-400 text-sm font-bold font-['Pretendard']">
              이용약관 및 개인정보 보호 방침
            </div>
            <div class="w-px h-2.5 bg-zinc-200"></div>
            <div class="text-slate-400 text-sm font-normal font-['Pretendard']">
              고객문의이메일
            </div>
            <div class="w-px h-2.5 bg-zinc-200"></div>
            <div class="text-slate-400 text-sm font-normal font-['Pretendard']">
              주소
            </div>
            <div class="w-px h-2.5 bg-zinc-200"></div>
            <div class="text-slate-400 text-sm font-normal font-['Pretendard']">
              통신판매업신고번호
            </div>
            <div class="w-px h-2.5 bg-zinc-200"></div>
            <div class="text-slate-400 text-sm font-normal font-['Pretendard']">
              사업자 등록번호
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
