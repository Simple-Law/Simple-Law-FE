import React from "react";

const JoinForm = ({ type }) => {
  return (
    <div>
      <h2>{type === "lawyer" ? "변호사" : "일반"} 회원가입 페이지</h2>
      {/* 회원가입 양식 및 기타 내용 */}
    </div>
  );
};

export default JoinForm;
