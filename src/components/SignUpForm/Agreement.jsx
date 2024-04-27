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
      <Checkbox
        checked={allChecked}
        onChange={handleCheckAllChange}
        className="text-gray-900 text-xl py-[10px] flex items-center"
      >
        전체 동의하기
      </Checkbox>
      <div className="w-full h-px bg-zinc-200 my-[10px]"></div>

      <div className="flex items-center justify-between">
        <Checkbox
          className="flex items-center py-[10px] text-neutral-400 text-base font-normal leading-tight"
          value="service"
          checked={checkedList.includes("service")}
          onChange={(e) => handleChange("service", e.target.checked)}
        >
          <span className="text-blue-500 pr-1">[필수]</span>
          서비스 이용약관 동의
        </Checkbox>
        <button className="text-xs text-Btn-Text-Disabled">보기</button>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          className="flex items-center  py-[10px] text-neutral-400 text-base font-normal leading-tight"
          value="privacy"
          checked={checkedList.includes("privacy")}
          onChange={(e) => handleChange("privacy", e.target.checked)}
        >
          <span className="text-blue-500 pr-1">[필수]</span>
          개인정보 취급방침 동의
        </Checkbox>
        <button className="text-xs text-Btn-Text-Disabled">보기</button>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          className="flex items-center  py-[10px] text-neutral-400 text-base font-normal leading-tight"
          value="marketing"
          checked={checkedList.includes("marketing")}
          onChange={(e) => handleChange("marketing", e.target.checked)}
        >
          <span className="pr-1">[선택]</span>
          혜택 및 마케팅 정보 수신 동의
        </Checkbox>
        <button className="text-xs text-Btn-Text-Disabled">보기</button>
      </div>
      <div className="w-full h-px bg-zinc-200 my-[10px]"></div>
      {type === "quest" && (
        <>
          <p className="text-Color-gray-900 text-base font-medium py-[10px]">
            이용자 연령 확인
          </p>
          <div className="w-full items-center justify-center flex flex-col rounded-md bg-primary px-4 py-4 my-[6px]">
            <p className="w-full text-gray-800 text-sm font-normal leading-tight">
              법률문제는 만 14세 미만 아동이 스스로 판단하기 힘든 복잡한 문제 일
              수 있습니다.
              <span className="text-red-500 text-sm font-semibold leading-tight">
                112 경찰청&nbsp;
              </span>
              또는
              <span className="text-red-500 text-sm font-semibold leading-tight">
                &nbsp;1577-1391 아동보호전문기관
              </span>
              에 연락해 도움을 받아보세요.
            </p>
          </div>
          <Checkbox
            className="flex items-center py-[10px] text-neutral-400 text-base font-normal leading-tight "
            value="age"
            checked={checkedList.includes("age")}
            onChange={(e) => handleChange("age", e.target.checked)}
          >
            만 14세 이상입니다.
          </Checkbox>
        </>
      )}
      <Button type="primary" block disabled={!isChecked} className="mt-8">
        다음
      </Button>
    </LoginForm>
  );
};

export default Agreement;
