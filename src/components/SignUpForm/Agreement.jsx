import LoginForm from "components/LoginForm";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "antd";

const Agreement = () => {
  const { type } = useParams();

  return (
    <LoginForm title="회원가입">
      <div class="w-full flex-col justify-start items-center gap-2.5 inline-flex">
        <div class="w-[400px] py-2.5 items-center gap-2 inline-flex">
          <div class="h-11 py-2.5 justify-start items-start gap-2 inline-flex">
            <div class="text-center text-gray-800 text-xl font-medium font-['Pretendard'] leading-tight">
              <Checkbox>전체 동의하기</Checkbox>
            </div>
          </div>
        </div>
        <div class="w-[400px] h-px bg-zinc-200"></div>
        <div class="w-[400px] flex-col justify-center items-center flex">
          <div class="w-[400px] py-2.5 justify-between items-center inline-flex">
            <div class="justify-center items-center gap-2 flex">
              <Checkbox>
                <div class="justify-center items-center gap-1 flex">
                  <div class="text-blue-500 text-base font-normal font-['Pretendard'] leading-tight">
                    [필수]
                  </div>
                  <div class="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    서비스 이용약관 동의
                  </div>
                </div>
              </Checkbox>
            </div>
            <div class="pr-3 justify-center items-center flex">
              <div class="text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                보기
              </div>
            </div>
          </div>
          <div class="w-[400px] h-11 py-2.5 justify-between items-center inline-flex">
            <div class="justify-start items-center gap-2 flex">
              <div class="w-[400px] items-center gap-1 flex">
                <div class="w-[400px] h-11 py-2.5 inline-flex">
                  <div class="w-[400px] justify-start items-center gap-2 flex">
                    <Checkbox>
                      <div class="justify-start items-center gap-1 flex">
                        <div class="text-blue-500 text-base font-normal font-['Pretendard'] leading-tight">
                          [필수]
                        </div>
                        <div class="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                          개인정보 취급방침 동의
                        </div>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="pr-3 justify-center items-center flex">
                    <div class="w-[21px] text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                      보기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-[400px] py-2.5 justify-between items-center inline-flex">
            <div class="justify-center items-center gap-2 flex">
              <Checkbox>
                <div class="justify-center items-center gap-1 flex">
                  <div class="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    [선택]
                  </div>
                  <div class="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    혜택 및 마케팅 정보 수신 동의
                  </div>
                </div>
              </Checkbox>
            </div>
            <div class="pr-3 justify-center items-center flex">
              <div class="text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                보기
              </div>
            </div>
          </div>
        </div>
        <div class="w-[400px] h-px bg-zinc-200"></div>
        <div class="w-full">
          <div class="w-full">
            {type === "quest" && (
              <div class="w-full py-2.5 mb-[28px] justify-center items-center gap-2 flex-col inline-flex">
                <div class="w-full pt-2.5 justify-center items-center gap-2.5 inline-flex">
                  <div class="w-[400px] h-[30px] pt-2.5 justify-start items-center gap-2.5 inline-flex">
                    <div class="text-gray-800 text-base font-semibold font-['Pretendard'] leading-tight">
                      이용자 연령 확인
                    </div>
                  </div>
                </div>
                <div class="w-full items-center flex flex-col">
                  <div class="w-full items-center justify-center flex flex-col">
                    <p class="w-[362px] text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight mb-[34px] mt-[28px]">
                      법률문제는 만 14세 미만 아동이 스스로 판단하기 힘든 복잡한
                      문제
                      <br />
                      <span>일 수 있습니다.</span>
                      <span class="text-red-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                        112 경찰청&nbsp;
                      </span>
                      <span class="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                        또는
                      </span>
                      <span class="text-red-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                        &nbsp;1577-1391 아동보호전문기관
                      </span>
                      <span class="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                        에 연락해 도움을 받아보세요.
                      </span>
                    </p>
                  </div>
                  <div class="w-[400px] items-center gap-2 flex">
                    <div class="justify-center items-center gap-2 flex"></div>
                    <div class="h-11 py-2.5 justify-start items-center gap-2 inline-flex">
                      <div class="justify-start items-center gap-2 flex">
                        <div class="justify-start items-center gap-2 flex">
                          <Checkbox>
                            <div class="text-center text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                              만 14세 이상입니다.
                            </div>
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div class="w-[400px] h-12 relative mt-[44px]">
              <div class="w-[400px] h-12 rounded-md bg-blue-500 cursor-pointer"></div>
              <div class="left-[185px] top-[14px] absolute text-center text-base font-semibold font-['Pretendard'] leading-tight text-white cursor-pointer">
                다음
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginForm>
  );
};

export default Agreement;
