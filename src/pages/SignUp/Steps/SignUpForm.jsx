import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Radio, Form } from "antd";
import PropTypes from "prop-types";
import { validationSchema } from "utils/validations";

import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";

import { formatBirthday } from "utils/formatters";

const JoinForm = ({ handleData, nextStep, type, handleSubmit }) => {
  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },

    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  // 생년월일 처리
  const handleBirthdayChange = e => {
    const formattedValue = formatBirthday(e.target.value); // 생년월일 포맷팅 적용
    setValue("birthDay", formattedValue);
  };

  const onFinish = async values => {
    handleData(values);
    if (type !== "lawyer") {
      await handleSubmit(values);
    } else {
      nextStep();
    }
  };

  return (
    <LoginForm title={type === "quest" ? "회원가입" : "변호사 회원가입"}>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          {/* 이메일 입력하며 중복검사 하나? */}
          {/* 이미 가입된 이메일입니다. 다른 이메일을 입력해 주세요. */}
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
              name='birthDay'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder='생년월일 8자리 (YYYY.MM.DD)'
                  maxLength='10'
                  {...field}
                  onChange={handleBirthdayChange} // 생년월일 포맷팅 적용
                />
              )}
            />
            {errors.birthDay && <p style={{ color: "red" }}>{errors.birthDay.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <Radio.Group buttonStyle='solid' className='w-full grid grid-cols-3 text-center' {...field}>
                  <Radio.Button value='MALE' className='!rounded-l-md'>
                    남자
                  </Radio.Button>
                  <Radio.Button value='FEMALE'>여자</Radio.Button>
                  <Radio.Button value='none' className='!rounded-r-md'>
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
