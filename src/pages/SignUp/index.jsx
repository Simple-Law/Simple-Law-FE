import React, { useState } from "react";
import JoinForm from "./Steps/JoinForm";
import Detail from "./Steps/Detail";
import Choice from "./Steps/Choice";
import Agreement from "./Steps/Agreement";
import FinalStep from "./Steps/FinalStep"; // FinalStep 컴포넌트 추가
import { useParams } from "react-router-dom";
import { registerUser } from "apis/usersApi";
import { useMessageApi } from "components/AppLayout";
import { useAuth } from "contexts/AuthContext"; // AuthContext import

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { type } = useParams();
  const messageApi = useMessageApi();
  const { login } = useAuth(); // AuthContext의 login 함수 사용

  const handleData = newData => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    setCurrentStep(nextIndex);
  };

  const handleSubmit = async () => {
    console.log("Form Data:", { ...formData });
    const {
      id = "",
      password = "",
      passwordConfirm = "",
      email = "",
      name = "",
      birthDay = "",
      phoneNumber = "",
      gender = "",
      companyName = "",
      companyPhone = "",
      barExam = "",
      barExamCount = "",
      yearOfPassing = "",
      fileUploadId = "",
      isMarketingConsent = false,
    } = formData;

    // 기본 필수 필드 구성
    const userData = {
      id: String(id),
      password: String(password),
      passwordConfirm: String(passwordConfirm),
      email: String(email),
      name: String(name),
      birthDay: String(birthDay),
      phoneNumber: String(phoneNumber ? phoneNumber.replace(/-/g, "") : ""), // 전화번호에서 하이픈 제거
      gender: gender ? String(gender).toUpperCase() : undefined, // 성별이 없는 경우 undefined 설정
      isMarketingConsent: Boolean(isMarketingConsent),
      type: type === "lawyer" ? "lawyer" : "member",
    };

    // 변호사일 경우 추가 필드 구성
    if (type === "lawyer") {
      Object.assign(userData, {
        companyName: String(companyName),
        companyPhone: String(companyPhone),
        barExam: String(barExam),
        barExamCount: String(barExamCount),
        yearOfPassing: String(yearOfPassing),
        fileUploadId: String(fileUploadId),
      });
    }

    try {
      const response = await registerUser(userData);
      console.log("Saved data", response);

      // 토큰 정보와 사용자 정보를 AuthContext에 저장
      // const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt } = response.payload;
      // const user = { id, email, name };
      // login({ accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt }, user);

      messageApi.success("가입이 완료되었습니다!");
      nextStep(); // 가입 완료 후 다음 단계로 이동
    } catch (error) {
      messageApi.error("가입에 실패했습니다.");
    }
  };

  const steps = [
    <Agreement handleData={handleData} nextStep={nextStep} />,
    <JoinForm handleData={handleData} nextStep={nextStep} type={type} handleSubmit={handleSubmit} />,
    type === "lawyer" && <Detail handleData={handleData} nextStep={nextStep} />,
    type === "lawyer" && <Choice handleData={handleData} nextStep={nextStep} handleSubmit={handleSubmit} />,
    <FinalStep type={type} />, // FinalStep 추가
  ].filter(Boolean); // 조건부 렌더링으로 undefined 요소 제거

  return <div>{steps[currentStep]}</div>;
};

export default SignUp;
