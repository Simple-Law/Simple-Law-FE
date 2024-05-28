import React from "react";
import { Button, Form } from "antd";
import LoginForm from "components/LoginForm";
import { useNavigate } from "react-router-dom";

import { registerUser } from "apis/usersApi";

const FinalSubmit = ({ formData, type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Form Data:", { ...formData, type });
    const status = type === "lawyer" ? "pending" : "approved"; // 변호사일 경우 status를 pending으로 설정
    try {
      const response = await registerUser({ ...formData, type, status });
      console.log("Saved data", response);
      alert("Registration successful!");
      navigate("/"); // 홈으로 리다이렉트
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed!");
    }
  };

  return (
    <LoginForm title="가입완료">
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item className="mt-8">
          <Button block type="primary" htmlType="submit">
            제출하세용
          </Button>
        </Form.Item>
      </Form>
    </LoginForm>
  );
};

export default FinalSubmit;
