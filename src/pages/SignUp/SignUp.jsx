import { useState } from "react";
import JoinForm from "./Steps/SignUpForm";
import Detail from "./Steps/Detail";
import Choice from "./Steps/Choice";
import Agreement from "./Steps/Agreement";
import FinalStep from "./Steps/FinalStep";
import { useParams } from "react-router-dom";
import { registerUser } from "apis/usersApi";
import { useMessageApi } from "components/messaging/MessageProvider";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { type } = useParams();
  const messageApi = useMessageApi();

  const handleData = newData => {
    setFormData(prev => {
      const updatedData = { ...prev, ...newData };
      return updatedData;
    });
  };

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    setCurrentStep(nextIndex);
  };

  const handleSubmit = async data => {
    const mergedData = { ...formData, ...data }; // 전달된 데이터를 병합
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
      caseCategoryKeyList = [],
      isMarketingConsent = false,
    } = mergedData;

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
        caseCategoryKeyList: caseCategoryKeyList.map(Number),
      });
    }

    try {
      const response = await registerUser(userData);
      console.log("Saved data", response);

      nextStep(); // 가입 완료 후 다음 단계로 이동
    } catch (error) {
      messageApi.error("가입에 실패했습니다.");
    }
  };

  const steps = [
    <Agreement key='agreement' handleData={handleData} nextStep={nextStep} />,
    <JoinForm key='joinForm' handleData={handleData} nextStep={nextStep} type={type} handleSubmit={handleSubmit} />,
    type === "lawyer" && <Detail key='detail' handleData={handleData} nextStep={nextStep} />,
    type === "lawyer" && (
      <Choice key='choice' handleData={handleData} nextStep={nextStep} handleSubmit={handleSubmit} />
    ),
    <FinalStep key='finalStep' type={type} />, // FinalStep 추가
  ].filter(Boolean); // 조건부 렌더링으로 undefined 요소 제거

  return <div>{steps[currentStep]}</div>;
};

export default SignUp;
