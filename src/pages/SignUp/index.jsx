import React, { useState } from "react";
import JoinForm from "./Steps/JoinForm";
import Detail from "./Steps/Detail";
import Choice from "./Steps/Choice";
import FinalSubmit from "./Steps/FinalSubmit";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    if (formData.role === "lawyer" && currentStep === 1) {
      setCurrentStep(nextIndex);
    } else if (formData.role !== "lawyer" && currentStep === 1) {
      // setCurrentStep(3);
      setCurrentStep(2);
    } else {
      setCurrentStep(nextIndex);
    }
  };

  const steps = [
    <JoinForm handleData={handleData} nextStep={nextStep} />,
    <Detail handleData={handleData} nextStep={nextStep} />,
    <Choice handleData={handleData} nextStep={nextStep} />,
    <FinalSubmit formData={formData} />,
  ];

  return <div>{steps[currentStep]}</div>;
};

export default SignUp;
