import React from "react";
// import axios from "axios";
import { Button } from "antd";
import LoginForm from "components/LoginForm";

const FinalSubmit = ({ formData }) => {
  const handleSubmit = (value) => {
    console.log(value);
  };
  //   console.log("Final form data:", formData);
  //   try {
  //     // json-server로 데이터 보내기
  //     const response = await axios.post(
  //       "http://localhost:3001/users",
  //       formData
  //     );
  //     console.log("Saved data", response.data);
  //     alert("Registration successful!");
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //     alert("Registration failed!");
  //   }
  // };

  return (
    <LoginForm title="가입완료">
      <Button block type="primary" onClick={handleSubmit}>
        제출하세용
      </Button>
    </LoginForm>
  );
};

export default FinalSubmit;
