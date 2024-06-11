import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const FinalStep = ({ type }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-96 p-6 bg-white rounded shadow-lg">
        <p className="text-center text-lg font-semibold mb-4">회원 가입 신청이 완료되었습니다</p>
        {type === "lawyer" && (
          <p className="text-center text-sm text-gray-600 mb-4">
            관리자 승인 후, 등록하신 사용자 아이디로 로그인이 가능합니다.
          </p>
        )}
        <Button block type="primary" className="mb-4" onClick={() => navigate("/")}>
          로그인
        </Button>
        <Button block onClick={() => navigate("/home")}>
          홈으로
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
