import { useState } from "react";
import JoinForm from "./Steps/SignUpForm";
// import Choice from "./Steps/Choice";
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
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async data => {
    const mergedData = { ...formData, ...data };

    const {
      email = "",
      name = "",
      password = "",

      birth = "",
      gender = "",
      isMarketingConsent = false,
    } = mergedData;

    let userData = {
      email: String(email),
      name: String(name),
      password: String(password),
      birth: String(birth), // "YYYY.MM.DD" 형식이어야 함
      gender: gender ? String(gender).toUpperCase() : undefined,
      terms: {
        serviceAgreement: true,
        privacyPolicyAgreement: true,
        // 마케팅 동의는 프론트엔드에서 입력받은 값을 사용
        marketingAgreement: Boolean(isMarketingConsent),
        ageOverAgreement: true,
      },
    };

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
    <FinalStep key='finalStep' type={type} />, // 최종 단계
  ].filter(Boolean);

  return <div>{steps[currentStep]}</div>;
};

export default SignUp;
