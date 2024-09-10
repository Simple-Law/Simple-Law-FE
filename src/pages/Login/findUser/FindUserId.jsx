import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Form } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { findUserIdSchema } from "utils/validations";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

const FindUserId = () => {
  // const { type } = useParams();

  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(findUserIdSchema),
    mode: "onBlur",
  });
  const onFinish = async values => {
    console.log("폼 제출 값:", values);

    setEmailAddress(values.email);
    setEmailSent(true);
  };
  // 이메일 발송 성공 후 메시지 화면
  if (emailSent) {
    return (
      <LoginForm>
        <div className='flex flex-col items-center justify-center'>
          <h2 className='mt-9 font-bold text-[32px] text-[#171717] tracking-[-0.64px] leading-10 mb-[14px]'>
            메일을 확인해 주세요
          </h2>
          <p className='text-[#94A3B8] text-base font-medium pb-10 border-b border-[#E3E9EE]'>
            {emailAddress}로 인증메일이 전송되었습니다
          </p>
          <p className='text-[#94A3B8] text-base font-medium leading-5 pb-[6px] mt-5'>메일이 오지 않았나요?</p>
          <p className='text-[#94A3B8] text-base font-medium'>
            스팸함을 확인하거나 인증메일을
            <span className='pl-1 text-Base-Blue font-semibold cursor-pointer' onClick={() => setEmailSent(false)}>
              재전송
            </span>
            하세요.
          </p>

          <Button type='primary' block className='px-4 py-3 h-12 text-base font-medium mt-[60px]'>
            <Link to='/login'>로그인</Link>
          </Button>
        </div>
      </LoginForm>
    );
  }

  return (
    <LoginForm title='아이디 찾기'>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <Form.Item
            validateStatus={errors.email ? "error" : "success"}
            help={errors.email?.message || ""} // 에러 메시지를 표시
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => <Input placeholder='이메일 입력' {...field} />}
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
              아이디 정보 발송
            </Button>
          </Form.Item>
        </div>
      </Form>
    </LoginForm>
  );
};

FindUserId.propTypes = {
  handleData: PropTypes.func,
};

export default FindUserId;
