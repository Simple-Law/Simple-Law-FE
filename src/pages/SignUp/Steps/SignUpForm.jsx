import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Radio, Form } from "antd";
import { verifyAuthCode, checkDuplicate } from "apis/usersApi";
import { useMessageApi } from "components/messaging/MessageProvider";
import PropTypes from "prop-types";
import { sendAuthCodeAction } from "../../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { validationSchema } from "utils/validations";

const JoinForm = ({ handleData, nextStep, type, handleSubmit }) => {
  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [idMessage, setIdMessage] = useState(null);
  const [idValidateStatus, setIdValidateStatus] = useState("");
  const [emailMessage, setEmailMessage] = useState(null);
  const [emailValidateStatus, setEmailValidateStatus] = useState("");

  const messageApi = useMessageApi();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [countdown]);

  const onFinish = async values => {
    try {
      const isVerified = await handleVerifyAuthCode();
      if (!isVerified) {
        console.log("Verification failed");
        return;
      }

      handleData(values);
      if (type !== "lawyer") {
        await handleSubmit(values);
      } else {
        nextStep();
      }
      console.log("폼 제출:", values);
    } catch (error) {
      console.error("Error in onFinish:", error);
    }
  };

  const handleBlur = async field => {
    const value = watch(field);
    if (!value) return;

    const fieldNames = {
      id: "아이디",
      email: "이메일",
    };

    const setFieldMessages = (field, errorMessage, successMessage) => {
      if (field === "id") {
        setIdMessage(errorMessage || successMessage);
        setIdValidateStatus(errorMessage ? "error" : "success");
      } else if (field === "email") {
        setEmailMessage(errorMessage || successMessage);
        setEmailValidateStatus(errorMessage ? "error" : "success");
      }
    };

    if (field === "id" && !/^[a-z0-9]{4,16}$/.test(value)) {
      setFieldMessages(field, "아이디는 영문 소문자와 숫자로 이루어진 4~16자로 입력해야 합니다!", "");
      return;
    }

    if (field === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      setFieldMessages(field, "올바른 이메일 양식이 아닙니다.", "");
      return;
    }

    try {
      const isDuplicate = await checkDuplicate(field, value);
      if (isDuplicate) {
        setFieldMessages(field, `이미 사용 중인 ${fieldNames[field]}입니다.`, "");
      } else {
        setFieldMessages(field, "", `사용 가능한 ${fieldNames[field]}입니다.`);
      }
    } catch (error) {
      console.error("Error in handleBlur:", error);
      messageApi.error(`${fieldNames[field]} 중복 검사 중 오류가 발생했습니다.`);
    }
  };

  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const phoneNumber = value.replace(/\D/g, "");
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    setValue("phoneNumber", formattedPhoneNumber);
  };

  const handleBirthdayChange = e => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, "");
    const formattedDate = formattedValue
      .split("")
      .reduce((acc, char, index) => (index === 4 || index === 6 ? acc + "." + char : acc + char), "");
    setValue("birthDay", formattedDate);
  };

  const handleAuthCodeChange = e => {
    const { value } = e.target;
    setValue("verificationCode", value);
  };

  const handleSendAuthCode = async () => {
    const phoneNumber = watch("phoneNumber");
    const name = watch("name");
    if (!phoneNumber || !name) {
      messageApi.error("이름과 휴대전화 번호를 입력하세요.");
      return;
    }

    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");

    try {
      await dispatch(sendAuthCodeAction(cleanedPhoneNumber, type));
      messageApi.success("인증번호가 발송되었습니다.");
      setShowAuthenticationCodeField(true);
      startTimer(180);
    } catch (error) {
      console.error("Error in handleSendAuthCode:", error);
      messageApi.error("인증번호 발송에 실패했습니다.");
      setShowAuthenticationCodeField(false);
    }
  };

  const handleVerifyAuthCode = async () => {
    const phoneNumber = watch("phoneNumber").replace(/-/g, "");
    const verificationCode = watch("verificationCode");
    if (!phoneNumber || !verificationCode) {
      messageApi.error("휴대전화 번호와 인증번호를 입력하세요.");
      return false;
    }

    try {
      await verifyAuthCode(phoneNumber, verificationCode, type);
      return true;
    } catch (error) {
      console.error("Error in handleVerifyAuthCode:", error);
      messageApi.error("인증번호가 올바르지 않습니다. 확인 후 다시 입력해 주세요.");
      return false;
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startTimer = seconds => {
    setTimer(seconds);
    if (countdown) clearInterval(countdown);
    const newCountdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(newCountdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setCountdown(newCountdown);
  };

  return (
    <LoginForm title={type === "quest" ? "회원가입" : "변호사 회원가입"}>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <Form.Item validateStatus={idValidateStatus} help={idMessage}>
            <Controller
              name='id'
              control={control}
              render={({ field }) => <Input placeholder='아이디 입력' {...field} onBlur={() => handleBlur("id")} />}
            />
            {errors.id && <p style={{ color: "red" }}>{errors.id.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='password'
              control={control}
              render={({ field }) => <Input type='password' placeholder='비밀번호 입력' {...field} />}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
          </Form.Item>

          <Form.Item>
            <Controller
              name='passwordConfirm'
              control={control}
              render={({ field }) => <Input type='password' placeholder='비밀번호 재확인' {...field} />}
            />
            {errors.passwordConfirm && <p style={{ color: "red" }}>{errors.passwordConfirm.message}</p>}
          </Form.Item>

          <Form.Item validateStatus={emailValidateStatus} help={emailMessage}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => <Input placeholder='이메일 입력' {...field} onBlur={() => handleBlur("email")} />}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
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
                <Input placeholder='생년월일 8자리' maxLength='10' {...field} onChange={handleBirthdayChange} />
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

          <Form.Item>
            <Controller
              name='phoneNumber'
              control={control}
              render={({ field }) => (
                <Input
                  style={{ width: "100%" }}
                  placeholder="휴대전화번호('-' 제외하고 입력)"
                  {...field}
                  onChange={handlePhoneNumberChange}
                  maxLength='13'
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
            <Form.Item>
              <Controller
                name='verificationCode'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='인증번호 입력'
                    {...field}
                    onChange={handleAuthCodeChange}
                    maxLength='4'
                    suffix={<span style={{ color: "#287fff" }}>{timer > 0 ? `${formatTime(timer)}` : ""}</span>}
                  />
                )}
              />
              {errors.verificationCode && <p style={{ color: "red" }}>{errors.verificationCode.message}</p>}
            </Form.Item>
          )}
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
