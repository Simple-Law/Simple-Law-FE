import LoginForm from "components/LoginForm";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Button } from "antd";

const Agreement = () => {
  const { type } = useParams();
  const [allChecked, setAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  // 버튼 활성화 여부 상태 업데이트
  useEffect(() => {
    const isAllChecked =
      (allChecked && checkedList.length === 4) ||
      (!allChecked &&
        checkedList.length === 3 &&
        checkedList.includes("service") &&
        checkedList.includes("privacy") &&
        checkedList.includes("age"));

    setIsChecked(isAllChecked);

    const isAllUnchecked =
      !checkedList.includes("service") ||
      !checkedList.includes("privacy") ||
      !checkedList.includes("marketing") ||
      !checkedList.includes("age");

    setAllChecked(!isAllUnchecked);
  }, [allChecked, checkedList]);

  // 전체 동의하기 체크박스 변화 처리
  const handleCheckAllChange = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setCheckedList(checked ? ["service", "privacy", "marketing", "age"] : []);
  };

  // 개별 체크박스 변화 처리
  const handleChange = (value, checked) => {
    const newList = checked
      ? [...checkedList, value]
      : checkedList.filter((item) => item !== value);

    setCheckedList(newList);
  };

  return (
    <LoginForm title="회원가입">
      <div className="w-full flex-col justify-start items-center gap-2.5 inline-flex">
        <div className="w-[400px] py-2.5 items-center gap-2 inline-flex">
          <div className="h-11 py-2.5 justify-start items-start gap-2 inline-flex">
            <div className="text-center text-gray-800 text-xl font-medium font-['Pretendard'] leading-tight">
              <Checkbox checked={allChecked} onChange={handleCheckAllChange}>
                전체 동의하기
              </Checkbox>
            </div>
          </div>
        </div>
        <div className="w-[400px] h-px bg-zinc-200"></div>
        <div className="w-[400px] flex-col justify-center items-center flex">
          <div className="w-[400px] py-2.5 justify-between items-center inline-flex">
            <div className="justify-center items-center gap-2 flex">
              <Checkbox
                value="service"
                checked={checkedList.includes("service")}
                onChange={(e) => handleChange("service", e.target.checked)}
              >
                <div className="justify-center items-center gap-1 flex">
                  <div className="text-blue-500 text-base font-normal font-['Pretendard'] leading-tight">
                    [필수]
                  </div>
                  <div className="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    서비스 이용약관 동의
                  </div>
                </div>
              </Checkbox>
            </div>
            <div className="pr-3 justify-center items-center flex">
              <div className="text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                보기
              </div>
            </div>
          </div>
          <div className="w-[400px] h-11 py-2.5 justify-between items-center inline-flex">
            <div className="justify-start items-center gap-2 flex">
              <div className="w-[400px] items-center gap-1 flex">
                <div className="w-[400px] h-11 py-2.5 inline-flex">
                  <div className="w-[400px] justify-start items-center gap-2 flex">
                    <Checkbox
                      value="privacy"
                      checked={checkedList.includes("privacy")}
                      onChange={(e) =>
                        handleChange("privacy", e.target.checked)
                      }
                    >
                      <div className="justify-start items-center gap-1 flex">
                        <div className="text-blue-500 text-base font-normal font-['Pretendard'] leading-tight">
                          [필수]
                        </div>
                        <div className="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                          개인정보 취급방침 동의
                        </div>
                      </div>
                    </Checkbox>
                  </div>
                  <div className="pr-3 justify-center items-center flex">
                    <div className="w-[21px] text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                      보기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[400px] py-2.5 justify-between items-center inline-flex">
            <div className="justify-center items-center gap-2 flex">
              <Checkbox
                value="marketing"
                checked={checkedList.includes("marketing")}
                onChange={(e) => handleChange("marketing", e.target.checked)}
              >
                <div className="justify-center items-center gap-1 flex">
                  <div className="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    [선택]
                  </div>
                  <div className="text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                    혜택 및 마케팅 정보 수신 동의
                  </div>
                </div>
              </Checkbox>
            </div>
            <div className="pr-3 justify-center items-center flex">
              <div className="text-center text-slate-400 text-xs font-normal font-['Pretendard'] leading-tight">
                보기
              </div>
            </div>
          </div>
        </div>
        <div className="w-[400px] h-px bg-zinc-200"></div>
        <div className="w-full">
          <div className="w-full">
            <div className="w-full py-2.5 mb-[28px] justify-center items-center gap-2 flex-col inline-flex">
              <div className="w-full pt-2.5 justify-center items-center gap-2.5 inline-flex">
                <div className="w-[400px] h-[30px] pt-2.5 justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-800 text-base font-semibold font-['Pretendard'] leading-tight">
                    이용자 연령 확인
                  </div>
                </div>
              </div>
              <div className="w-full items-center flex flex-col">
                <div className="w-full items-center justify-center flex flex-col">
                  <p className="w-[362px] text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight mb-[34px] mt-[28px]">
                    법률문제는 만 14세 미만 아동이 스스로 판단하기 힘든 복잡한
                    문제
                    <br />
                    <span>일 수 있습니다.</span>
                    <span className="text-red-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                      112 경찰청&nbsp;
                    </span>
                    <span className="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                      또는
                    </span>
                    <span className="text-red-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                      &nbsp;1577-1391 아동보호전문기관
                    </span>
                    <span className="text-gray-800 text-sm font-normal font-['Pretendard'] leading-tight">
                      에 연락해 도움을 받아보세요.
                    </span>
                  </p>
                </div>
                <div className="w-[400px] items-center gap-2 flex">
                  <div className="justify-center items-center gap-2 flex"></div>
                  <div className="h-11 py-2.5 justify-start items-center gap-2 inline-flex">
                    <div className="justify-start items-center gap-2 flex">
                      <div className="justify-start items-center gap-2 flex">
                        <Checkbox
                          value="age"
                          checked={checkedList.includes("age")}
                          onChange={(e) =>
                            handleChange("age", e.target.checked)
                          }
                        >
                          <div className="text-center text-neutral-400 text-base font-normal font-['Pretendard'] leading-tight">
                            만 14세 이상입니다.
                          </div>
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button type="primary" block disabled={!isChecked}>
              다음
            </Button>
          </div>
        </div>
      </div>
    </LoginForm>
  );
};

export default Agreement;
