import React from "react";
import { Button, Form } from "antd";
import LoginForm from "components/LoginForm";
import { useNavigate } from "react-router-dom";
import { registerUser } from "apis/usersApi";
import { useMessageApi } from "components/AppLayout";
import { useAuth } from "contexts/AuthContext"; // AuthContext import

const FinalSubmit = ({ formData, type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const messageApi = useMessageApi();
  const { login } = useAuth(); // AuthContext의 login 함수 사용

  const handleSubmit = async () => {
    console.log("Form Data:", { ...formData });
    const {
      id,
      password,
      passwordConfirm,
      email,
      name,
      birthDay,
      phoneNumber,
      gender,
      companyName,
      companyPhone,
      barExam,
      barExamCount,
      yearOfPassing,
      fileUploadId,
      isMarketingConsent,
    } = formData;

    // 기본 필수 필드 구성
    const userData = {
      id: String(id),
      password: String(password),
      passwordConfirm: String(passwordConfirm),
      email: String(email),
      name: String(name),
      birthDay: String(birthDay),
      phoneNumber: String(phoneNumber.replace(/-/g, "")), // 전화번호에서 하이픈 제거
      gender: gender ? String(gender).toUpperCase() : undefined, // 성별이 없는 경우 undefined 설정
      isMarketingConsent: Boolean(isMarketingConsent),
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
      const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt } = response.data.payload;
      const user = { id, email, name };
      login({ accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt }, user);

      messageApi.success("가입이 완료되었습니다!");
      navigate("/"); // 홈으로 리다이렉트
    } catch (error) {
      messageApi.error("가입에 실패했습니다.");
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
