import { useState } from "react";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Form } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { findUserPWSchema } from "utils/validations"; // 유효성 검사 스키마 가져오기
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { formatPhoneNumber } from "utils/formatters";
import { useAuthCode } from "utils/verification";
import { useParams } from "react-router-dom";
const FindPassword = () => {
  const { type } = useParams();
  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(findUserPWSchema),
    mode: "onBlur",
  });

  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const { handleSendAuthCode, handleVerifyAuthCode, handleAuthCodeChange, formatTime, timer } = useAuthCode(
    watch,
    setShowAuthenticationCodeField,
    setValue,
  );

  // 전화번호 처리
  const handlePhoneNumberChange = e => {
    const formattedValue = formatPhoneNumber(e.target.value); // 전화번호 포맷팅 적용
    setValue("phoneNumber", formattedValue);
  };

  const onFinish = async values => {
    console.log("폼 제출 값:", values);
    const isVerified = await handleVerifyAuthCode(type);
    if (!isVerified) return;
  };

  return (
    <LoginForm title='비밀번호 찾기'>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <Form.Item validateStatus={errors.id ? "error" : ""} help={errors.id?.message || ""}>
            <Controller
              name='id'
              control={control}
              render={({ field }) => <Input placeholder='아이디 입력' {...field} />}
            />
          </Form.Item>

          <Form.Item validateStatus={errors.name ? "error" : ""} help={errors.name?.message || ""}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <Input placeholder='이름 입력' {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Controller
              name='phoneNumber'
              control={control}
              render={({ field }) => (
                <Input
                  style={{ width: "100%" }}
                  placeholder="휴대전화번호('-' 제외하고 입력)"
                  {...field}
                  maxLength='13'
                  onChange={handlePhoneNumberChange} // 전화번호 포맷팅 적용
                  suffix={
                    <p
                      onClick={handleSendAuthCode}
                      disabled={!watch("phoneNumber")}
                      style={{ color: "#287fff", cursor: "pointer" }}
                    >
                      {showAuthenticationCodeField ? "재전송" : "인증 요청"}
                    </p>
                  }
                />
              )}
            />
            {errors.phoneNumber && <p style={{ color: "red" }}>{errors.phoneNumber.message}</p>}
          </Form.Item>

          {showAuthenticationCodeField && (
            <Form.Item
              validateStatus={errors.verificationCode ? "error" : ""}
              help={errors.verificationCode?.message || ""}
            >
              <Controller
                name='verificationCode'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='인증번호 입력'
                    {...field}
                    maxLength='4'
                    onChange={handleAuthCodeChange}
                    suffix={<span style={{ color: "#287fff" }}>{timer > 0 ? formatTime(timer) : "0:00"}</span>}
                  />
                )}
              />
              {errors.verificationCode && <p style={{ color: "red" }}>{errors.verificationCode.message}</p>}
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type='primary'
              block
              className='px-4 py-3 h-12 text-base font-medium'
              htmlType='submit'
              disabled={!isValid}
            >
              비밀번호 찾기
            </Button>
          </Form.Item>
        </div>
      </Form>
    </LoginForm>
  );
};

FindPassword.propTypes = {
  handleData: PropTypes.func,
};

export default FindPassword;
