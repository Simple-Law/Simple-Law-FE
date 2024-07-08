import { useState } from "react";
import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Radio, Form } from "antd";
import { verifyAuthCode, checkDuplicate } from "apis/usersApi";
import { useMessageApi } from "components/messaging/MessageProvider";
import PropTypes from "prop-types";
import moment from "moment";
import { sendAuthCodeAction } from "../../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { formatDotDate } from "utils/dateUtil";

const JoinForm = ({ handleData, nextStep, type, handleSubmit }) => {
  const [form] = Form.useForm();
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [idMessage, setIdMessage] = useState(null);
  const [idValidateStatus, setIdValidateStatus] = useState("");
  const [emailMessage, setEmailMessage] = useState(null);
  const [emailValidateStatus, setEmailValidateStatus] = useState("");

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  // 회원가입 폼 제출
  const onFinish = async values => {
    try {
      // 인증번호 검증
      const isVerified = await handleVerifyAuthCode();
      if (!isVerified) {
        console.log("Verification failed");
        return; // 인증 실패 시 함수 종료
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

  // 중복검사
  const handleBlur = async field => {
    const value = form.getFieldValue(field);
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

    // 정규식 검사
    if (field === "id" && !/^[a-z0-9]{4,16}$/.test(value)) {
      setFieldMessages(field, "아이디는 영문 소문자와 숫자로 이루어진 4~16자로 입력해야 합니다!", "");
      form.setFields([{ name: field, errors: ["아이디는 영문 소문자와 숫자로 이루어진 4~16자로 입력해야 합니다!"] }]);
      return;
    }

    try {
      const isDuplicate = await checkDuplicate(field, value);
      if (isDuplicate) {
        setFieldMessages(field, `이미 사용 중인 ${fieldNames[field]}입니다.`, "");
        form.setFields([{ name: field, errors: [`이미 사용 중인 ${fieldNames[field]}입니다.`] }]);
      } else {
        setFieldMessages(field, "", `사용 가능한 ${fieldNames[field]}입니다.`);
        form.setFields([{ name: field, errors: [] }]);
      }
    } catch (error) {
      console.error("Error in handleBlur:", error);
      messageApi.error(`${fieldNames[field]} 중복 검사 중 오류가 발생했습니다.`);
    }
  };

  // 폼 필드 값이 변경 시 호출
  const handleFormChange = (_, allValues) => {
    const requiredFields = [
      "id",
      "password",
      "passwordConfirm",
      "email",
      "name",
      "birthDay",
      "gender",
      "phoneNumber",
      "verificationCode",
    ];
    const isAllFieldsFilled = requiredFields.every(key => {
      return allValues[key] !== undefined && allValues[key] !== "";
    });

    setIsFormFilled(isAllFieldsFilled);
  };

  // 타이머 변환
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // 타이머 시작
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

  // 핸드폰 번호 확인
  const validPhoneNumber = (phoneNumberInput, value) => {
    if (!value || !value.startsWith("010")) {
      return Promise.reject(new Error(phoneNumberInput.message));
    } else {
      return Promise.resolve();
    }
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

  // 핸드폰 번호 하이픈 추가
  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const phoneNumber = value.replace(/\D/g, "");
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    form.setFieldsValue({ phoneNumber: formattedPhoneNumber });
  };

  // 인증코드 확인
  const handleAuthCodeChange = e => {
    const { value } = e.target;
    form.setFieldsValue({ verificationCode: value });
    handleFormChange({}, { ...form.getFieldsValue(), verificationCode: value });
  };

  // 인증 코드를 전송하는 함수
  const handleSendAuthCode = async () => {
    const phoneNumber = form.getFieldValue("phoneNumber");
    const name = form.getFieldValue("name");
    if (!phoneNumber || !name) {
      messageApi.error("이름과 휴대전화 번호를 입력하세요.");
      return;
    }

    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");

    try {
      await dispatch(sendAuthCodeAction(cleanedPhoneNumber, type));
      messageApi.success("인증번호가 발송되었습니다.");
      setShowAuthenticationCodeField(true);
      startTimer(180); // 기본값 180초 설정
    } catch (error) {
      console.error("Error in handleSendAuthCode:", error);
      messageApi.error("인증번호 발송에 실패했습니다.");
      setShowAuthenticationCodeField(false);
    }
  };

  // 인증 코드를 확인하는 함수
  const handleVerifyAuthCode = async () => {
    const phoneNumber = form.getFieldValue("phoneNumber").replace(/-/g, "");
    const verificationCode = form.getFieldValue("verificationCode");
    if (!phoneNumber || !verificationCode) {
      messageApi.error("휴대전화 번호와 인증번호를 입력하세요.");
      return;
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

  return (
    <LoginForm title={type === "quest" ? "회원가입" : "변호사 회원가입"}>
      <Form form={form} name='validateOnly' onFinish={onFinish} onValuesChange={handleFormChange}>
        <div className='flex gap-2 flex-col'>
          <Form.Item
            name='id'
            rules={[
              {
                required: true,
                message: "아이디는 필수로 입력해야 합니다!",
              },
              {
                pattern: /^[a-z0-9]{4,16}$/,
                message: "아이디는 영문 소문자와 숫자로 이루어진 4~16자로 입력해야 합니다!",
              },
            ]}
            validateStatus={idValidateStatus}
            help={idMessage}
          >
            <Input placeholder='아이디 입력' onBlur={() => handleBlur("id")} />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { whitespace: true, required: true, message: "비밀번호를 입력해주세요" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve(); // 이미 required rule에서 메시지를 처리하므로 여기서는 resolve
                  }
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /[0-9]/.test(value);
                  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                  const isValid =
                    (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0) >=
                    3;

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
          >
            <Input type='password' placeholder='비밀번호 입력' />
          </Form.Item>

          <Form.Item
            name='passwordConfirm'
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
          >
            <Input type='password' placeholder='비밀번호 재확인' />
          </Form.Item>

          <Form.Item
            name='email'
            rules={[
              {
                whitespace: true,
                required: true,
                type: "email",
                message: "올바른 이메일 양식이 아닙니다.",
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "이메일은 영문자와 숫자로만 이루어져야 합니다.",
              },
            ]}
            validateStatus={emailValidateStatus}
            help={emailMessage}
          >
            <Input placeholder='이메일 입력' onBlur={() => handleBlur("email")} />
          </Form.Item>
        </div>
        <div className='w-full h-px bg-zinc-200 my-[20px]'></div>
        <div className='flex gap-2 flex-col'>
          <Form.Item
            name='name'
            rules={[
              {
                whitespace: true,
                required: true,
                message: "이름은 필수로 입력해야 합니다.",
              },
            ]}
          >
            <Input placeholder='이름' />
          </Form.Item>
          <Form.Item
            name='birthDay'
            rules={[
              {
                required: true,
                message: "생년월일을 입력하세요.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve(); // 이미 required rule에서 메시지를 처리하므로 여기서는 resolve
                  }
                  const birthDate = formatDotDate(value);
                  if (!birthDate.isValid() || moment().diff(birthDate, "years") >= 200) {
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
            <Input placeholder='생년월일 8자리' maxLength='10' onChange={handleBirthdayChange} />
          </Form.Item>

          <Form.Item name='gender'>
            <Radio.Group buttonStyle='solid' className='w-full grid grid-cols-3 text-center'>
              <Radio.Button value='MALE' className='!rounded-l-md'>
                남자
              </Radio.Button>
              <Radio.Button value='FEMALE'>여자</Radio.Button>
              <Radio.Button value='none' className='!rounded-r-md'>
                선택안함
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name='phoneNumber'
            rules={[
              {
                whitespace: true,
                required: true,
                validator: validPhoneNumber,
                message: "올바른 전화번호 양식이 아닙니다.",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="휴대전화번호('-' 제외하고 입력)"
              onChange={handlePhoneNumberChange}
              maxLength='13'
              suffix={
                <p
                  onClick={handleSendAuthCode}
                  disabled={!form.getFieldValue("phoneNumber")}
                  style={{ color: "#287fff", cursor: "pointer" }}
                >
                  {showAuthenticationCodeField ? "재전송" : "인증 요청"}
                </p>
              }
            />
          </Form.Item>
          {showAuthenticationCodeField && (
            <Form.Item name='verificationCode'>
              <Input
                placeholder='인증번호 입력'
                onChange={handleAuthCodeChange}
                maxLength='4'
                suffix={<span style={{ color: "#287fff" }}>{timer > 0 ? `${formatTime(timer)}` : ""}</span>}
              />
            </Form.Item>
          )}
        </div>
        <Form.Item className='mt-8'>
          <Button type='primary' htmlType='submit' disabled={!isFormFilled} block>
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
