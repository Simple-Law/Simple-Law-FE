import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Radio, Form } from "antd";
import PropTypes from "prop-types";
import { validationSchema } from "utils/validations";
import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";
import { formatBirthday } from "utils/formatters";
import { checkEmailExist } from "apis/usersApi"; // 이메일 중복 검사 API 함수
import { useState } from "react";

const JoinForm = ({ handleData, nextStep, type, handleSubmit }) => {
  const [emailAvailable, setEmailAvailable] = useState(null);

  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  // 생년월일 처리
  const handleBirthdayChange = e => {
    const formattedValue = formatBirthday(e.target.value);
    setValue("birth", formattedValue);
  };

  // 이메일 중복 검사 핸들러 (onBlur 시 호출)
  const handleEmailBlur = async e => {
    const email = e.target.value;
    if (email) {
      try {
        const exist = await checkEmailExist(email);
        if (exist) {
          setError("email", {
            type: "manual",
            message: "이미 가입된 이메일입니다. 다른 이메일을 입력해 주세요.",
          });
          setEmailAvailable(null);
        } else {
          clearErrors("email");
          setEmailAvailable("사용 가능한 이메일입니다.");
        }
      } catch (error) {
        console.error("이메일 중복 검사 실패:", error);
        setEmailAvailable(null);
      }
    }
  };

  const onFinish = async values => {
    handleData(values);
    await handleSubmit(values);
  };

  return (
    <LoginForm title={type === "quest" ? "회원가입" : "변호사 회원가입"}>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <Form.Item
            validateStatus={errors.email ? "error" : emailAvailable ? "success" : ""}
            help={errors.email?.message || emailAvailable || ""}
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder='이메일 입력'
                  {...field}
                  onBlur={e => {
                    field.onBlur();
                    handleEmailBlur(e);
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input.Password
                  type='password'
                  placeholder='비밀번호 입력'
                  {...field}
                  iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
                />
              )}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='passwordConfirm'
              control={control}
              render={({ field }) => (
                <Input.Password
                  type='password'
                  placeholder='비밀번호 재확인'
                  {...field}
                  iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
                />
              )}
            />
            {errors.passwordConfirm && <p style={{ color: "red" }}>{errors.passwordConfirm.message}</p>}
          </Form.Item>
        </div>

        <div className='w-full h-px bg-zinc-200 my-[20px]'></div>

        <div className='flex gap-2 flex-col'>
          <Form.Item>
            <Controller name='name' control={control} render={({ field }) => <Input placeholder='이름' {...field} />} />
            {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='birth'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder='생년월일 8자리 (YYYY.MM.DD)'
                  maxLength='10'
                  {...field}
                  onChange={handleBirthdayChange}
                />
              )}
            />
            {errors.birth && <p style={{ color: "red" }}>{errors.birth.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <Radio.Group buttonStyle='solid' className='w-full grid grid-cols-3 text-center' {...field}>
                  <Radio.Button value='M' className='!rounded-l-md'>
                    남자
                  </Radio.Button>
                  <Radio.Button value='W'>여자</Radio.Button>
                  <Radio.Button value='U' className='!rounded-r-md'>
                    선택안함
                  </Radio.Button>
                </Radio.Group>
              )}
            />
            {errors.gender && <p style={{ color: "red" }}>{errors.gender.message}</p>}
          </Form.Item>
        </div>

        <Form.Item className='mt-8'>
          <Button type='primary' htmlType='submit' disabled={!isValid} block>
            가입하기
          </Button>
        </Form.Item>
      </Form>
    </LoginForm>
  );
};

JoinForm.propTypes = {
  handleData: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default JoinForm;
