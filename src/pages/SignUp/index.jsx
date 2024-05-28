import React, { useState } from "react";
import JoinForm from "./Steps/JoinForm";
import Detail from "./Steps/Detail";
import Choice from "./Steps/Choice";
import FinalSubmit from "./Steps/FinalSubmit";
import Agreement from "./Steps/Agreement";
import { useParams } from "react-router-dom";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { type } = useParams();
  const handleData = newData => {
    console.log("이상하네", newData);

    setFormData(prev => ({ ...prev, ...newData }));
  };
  console.log(" 나와", formData);

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    if (type === "lawyer" && currentStep === 1) {
      setCurrentStep(nextIndex);
    } else if (type !== "lawyer" && currentStep === 1) {
      // setCurrentStep(3);
      setCurrentStep(4);
    } else {
      setCurrentStep(nextIndex);
    }
  };

  const steps = [
    <Agreement handleData={handleData} nextStep={nextStep} />,
    <JoinForm handleData={handleData} nextStep={nextStep} />,
    <Detail handleData={handleData} nextStep={nextStep} />,
    <Choice handleData={handleData} nextStep={nextStep} />,
    <FinalSubmit formData={formData} type={type} />,
  ];

  return <div>{steps[currentStep]}</div>;
};

export default SignUp;
