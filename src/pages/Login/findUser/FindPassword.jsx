import { useState } from "react";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Form } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { findUserPWSchema } from "utils/validations";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { formatPhoneNumber } from "utils/formatters";
import { useAuthCode } from "utils/verification";
import { useParams } from "react-router-dom";
import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";

const FindPassword = () => {
  const { type } = useParams();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(findUserPWSchema),
    mode: "onBlur",
  });

  const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부를 관리하는 상태
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const { handleSendAuthCode, handleVerifyAuthCode, handleAuthCodeChange, formatTime, timer } = useAuthCode(
    watch,
    setShowAuthenticationCodeField,
    setValue,
  );

  // 전화번호 처리
  const handlePhoneNumberChange = e => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setValue("phoneNumber", formattedValue);
  };

  // 인증번호 제출 시 핸들러
  const handleVerifySubmit = async values => {
    console.log("폼 제출 값 (인증번호 확인):", values);
    const verified = await handleVerifyAuthCode(type);
    if (verified) {
      reset({ password: "", passwordConfirm: "" }); // 비밀번호 필드 초기화
      setIsVerified(true);
    }
  };

  // 비밀번호 재설정 제출 시 핸들러
  const handleResetPasswordSubmit = async values => {
    console.log("폼 제출 값 (비밀번호 재설정):", values);
    // 비밀번호 재설정 로직 추가
  };

  // 비밀번호 재설정 화면
  if (isVerified) {
    return (
      <LoginForm title='비밀번호 재설정'>
        <Form onFinish={handleSubmit(handleResetPasswordSubmit)}>
          <div className='flex gap-2 flex-col'>
            <Form.Item validateStatus={errors.password ? "error" : ""} help={errors.password?.message || ""}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <Input.Password
                    placeholder='새 비밀번호 입력'
                    {...field}
                    iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.passwordConfirm ? "error" : ""}
              help={errors.passwordConfirm?.message || ""}
            >
              <Controller
                name='passwordConfirm'
                control={control}
                render={({ field }) => (
                  <Input.Password
                    placeholder='비밀번호 재입력'
                    {...field}
                    iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
                  />
                )}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                block
                className='px-4 py-3 h-12 text-base font-medium'
                htmlType='submit'
                disabled={!isValid}
              >
                비밀번호 재설정
              </Button>
            </Form.Item>
          </div>
        </Form>
      </LoginForm>
    );
  }

  // 인증번호 입력 화면
  return (
    <LoginForm title='비밀번호 찾기'>
      <Form onFinish={handleSubmit(handleVerifySubmit)}>
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
                  onChange={handlePhoneNumberChange}
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
