import React, { useState } from "react";
import LoginForm from "components/LoginForm";
import { Input, Button, Radio, Form } from "antd";
import moment from "moment";
import { sendAuthCode, verifyAuthCode } from "apis/usersApi";
import { useMessageApi } from "components/AppLayout";

const JoinForm = ({ handleData, nextStep, type }) => {
  const [form] = Form.useForm();
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isAuthCodeFilled, setIsAuthCodeFilled] = useState(false);
  const messageApi = useMessageApi();

  // 핸드폰 번호 확인
  const validPhoneNumber = (phoneNumberInput, value) => {
    if (!value || !value.startsWith("010")) {
      return Promise.reject(new Error(phoneNumberInput.message));
    } else {
      return Promise.resolve();
    }
  };

  // 핸드폰 번호 하이픈 추가
  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const phoneNumber = value.replace(/\D/g, "");
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    form.setFieldsValue({ phoneNumber: formattedPhoneNumber });
  };

  // 회원가입 폼 제출
  const onFinish = values => {
    console.log("결과값: ", values);
    handleData(values);
    nextStep();
  };
  const handleFormChange = (changedValues, allValues) => {
    const isAllFieldsFilled = Object.keys(allValues).every(key => allValues[key]);
    setIsFormFilled(isAllFieldsFilled);
  };

  // 생년월일 dot 추가
  const handleBirthdayChange = e => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, "");
    const formattedDate = formattedValue
      .split("")
      .reduce((acc, char, index) => (index === 4 || index === 6 ? acc + "." + char : acc + char), "");
    form.setFieldsValue({ birthDay: formattedDate });
  };

  // 전화번호 인증
  const handleAuthCodeChange = e => {
    const { value } = e.target;
    if (value.length === 4) {
      setIsAuthCodeFilled(true);
    } else {
      setIsAuthCodeFilled(false);
    }
  };
  const handleSendAuthCode = async () => {
    const phoneNumber = form.getFieldValue("phoneNumber").replace(/-/g, "");
    const name = form.getFieldValue("name");
    if (!phoneNumber || !name) {
      messageApi.error("이름과 휴대전화 번호를 입력하세요.");
      return;
    }

    try {
      await sendAuthCode(phoneNumber, type);
      messageApi.success("인증번호가 발송되었습니다.");
      setShowAuthenticationCodeField(true);
    } catch (error) {
      messageApi.error("인증번호 발송에 실패했습니다.");
      setShowAuthenticationCodeField(true);
    }
  };

  const handleVerifyAuthCode = async () => {
    const phoneNumber = form.getFieldValue("phoneNumber").replace(/-/g, "");
    const verificationCode = form.getFieldValue("verificationCode");
    if (!phoneNumber || !verificationCode) {
      messageApi.error("휴대전화 번호와 인증번호를 입력하세요.");
      return;
    }

    try {
      await verifyAuthCode(phoneNumber, verificationCode, type);
      form.submit();
    } catch (error) {
      messageApi.error("인증번호 확인에 실패했습니다.");
      form.submit();
    }
  };

  return (
    <LoginForm title="회원가입">
      <Form form={form} name="validateOnly" onFinish={onFinish} onValuesChange={handleFormChange}>
        <div className="flex gap-2 flex-col">
          <Form.Item
            name="id"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "아이디는 필수로 입력해야 합니다!",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="아이디 입력" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { whitespace: true, required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error("비밀번호를 입력해주세요"));
                  }
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /[0-9]/.test(value);
                  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                  const isValid =
                    (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0) >=
                    2;
                  if (value.length < 8 || value.length > 16 || !isValid) {
                    return Promise.reject(
                      new Error(
                        "비밀번호 취약 : 8~16자의 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 사용해야 합니다.",
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input type="password" placeholder="비밀번호 입력" />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "비밀번호가 일치하지 않습니다.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input type="password" placeholder="비밀번호 재확인" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                whitespace: true,
                required: true,
                type: "email",
                message: "올바른 이메일 양식이 아닙니다.",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="이메일 입력" />
          </Form.Item>
        </div>
        <div className="w-full h-px bg-zinc-200 my-[20px]"></div>
        <div className="flex gap-2 flex-col">
          <Form.Item
            name="name"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "이름은 필수로 입력해야 합니다.",
              },
            ]}
          >
            <Input placeholder="이름" />
          </Form.Item>

          <Form.Item
            name="birthDay"
            rules={[
              {
                required: true,
                message: "생년월일을 입력하세요.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const birthDate = moment(value, "YYYY.MM.DD");
                  if (!birthDate.isValid()) {
                    return Promise.reject(new Error("올바른 날짜 형식이 아닙니다."));
                  }
                  const age = moment().diff(birthDate, "years");
                  if (age < 14) {
                    return Promise.reject(new Error("14세 미만은 가입이 불가능합니다."));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="생년월일 8자리" maxLength="10" onChange={handleBirthdayChange} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                whitespace: true,
                required: true,
                validator: validPhoneNumber,
                message: "올바른 전화번호 양식이 아닙니다.",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="휴대전화번호('-' 제외하고 입력)" onChange={handlePhoneNumberChange} maxLength="13" />
          </Form.Item>
          <Form.Item name="gender">
            <Radio.Group buttonStyle="solid" className="w-full grid grid-cols-3 text-center">
              <Radio.Button value="MALE" className="!rounded-l-md">
                남자
              </Radio.Button>
              <Radio.Button value="FEMALE">여자</Radio.Button>
              <Radio.Button value="none" className="!rounded-r-md">
                선택안함
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {showAuthenticationCodeField && (
            <Form.Item name="verificationCode">
              <Input placeholder="인증번호 입력" onChange={handleAuthCodeChange} maxLength="4" />
            </Form.Item>
          )}
        </div>
        <Form.Item className="mt-8">
          <Button
            type="primary"
            onClick={() => {
              if (isAuthCodeFilled) {
                handleVerifyAuthCode();
              } else {
                handleSendAuthCode();
              }
            }}
            disabled={!isFormFilled}
            block
          >
            {isAuthCodeFilled ? "가입하기" : "인증 요청"}
          </Button>
        </Form.Item>
      </Form>
    </LoginForm>
  );
};

export default JoinForm;
