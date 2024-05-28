// import React, { useState } from "react";
// import LoginForm from "components/LoginForm";
// import { Input, Button, Radio, Form } from "antd";
// import moment from "moment";
// // import SubmitButton from "components/SubmitButton";
// import { useParams } from "react-router-dom";

// const JoinForm = ({ handleData, nextStep }) => {
//   const [form] = Form.useForm();
//   const { type } = useParams();
//   console.log(type);
//   const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);

//   const validPhoneNumber = (phoneNumberInput, value) => {
//     if (!value || !value.startsWith("010")) {
//       return Promise.reject(new Error(phoneNumberInput.message));
//     } else {
//       return Promise.resolve();
//     }
//   };

//   const handlePhoneNumberChange = e => {
//     const { value } = e.target;
//     const phoneNumber = value.replace(/\D/g, "");
//     const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
//     form.setFieldsValue({ tel: formattedPhoneNumber });
//   };

//   const onFinish = values => {
//     console.log("결과값: ", values);
//     handleData(values);
//     nextStep();
//   };

//   const handleInputChange = e => {
//     const { value } = e.target;
//     // 숫자 이외의 문자 제거
//     const formattedValue = value.replace(/\D/g, "");
//     // 구분자를 추가하여 출력
//     const formattedDate = formattedValue
//       .split("")
//       .reduce((acc, char, index) => (index === 4 || index === 6 ? acc + "." + char : acc + char), "");
//     // 폼 필드에 값을 설정
//     form.setFieldsValue({ birthday: formattedDate });
//   };
//   // const handleFormChange = (changedValues, allValues) => {
//   //   // 모든 필드가 채워졌을 때 인증번호 입력 필드를 표시합니다.
//   //   const isFormFilled = Object.keys(allValues).every((key) => allValues[key]);
//   //   setShowAuthenticationCodeField(isFormFilled);
//   // };

//   return (
//     <LoginForm title="회원가입">
//       <Form
//         form={form}
//         name="validateOnly"
//         onFinish={onFinish}
//         // onValuesChange={handleFormChange}
//       >
//         <div className="flex gap-2 flex-col">
//           <Form.Item
//             name="id"
//             rules={[
//               {
//                 whitespace: true,

//                 message: "아이디는 필수로 입력해야 합니다!",
//               },
//             ]}
//             validateTrigger="onBlur"
//           >
//             <Input placeholder="아이디 입력" />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             rules={[
//               { whitespace: true },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value) {
//                     return Promise.reject(new Error("비밀번호를 입력해주세요"));
//                   }
//                   const hasUpperCase = /[A-Z]/.test(value);
//                   const hasLowerCase = /[a-z]/.test(value);
//                   const hasNumber = /[0-9]/.test(value);
//                   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
//                   const isValid =
//                     (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0) >=
//                     2;
//                   if (value.length < 8 || value.length > 16 || !isValid) {
//                     return Promise.reject(
//                       new Error(
//                         "비밀번호 취약 : 8~16자의 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 사용해야 합니다.",
//                       ),
//                     );
//                   }
//                   return Promise.resolve();
//                 },
//               }),
//             ]}
//             validateTrigger="onBlur"
//           >
//             <Input type="password" placeholder="비밀번호 입력" />
//           </Form.Item>
//           <Form.Item
//             name="confirm"
//             dependencies={["password"]}
//             rules={[
//               {
//                 message: "비밀번호가 일치하지 않습니다.",
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("password") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
//                 },
//               }),
//             ]}
//             validateTrigger="onBlur"
//           >
//             <Input type="password" placeholder="비밀번호 재확인" />
//           </Form.Item>

//           <Form.Item
//             name="email"
//             rules={[
//               {
//                 whitespace: true,

//                 type: "email",
//                 message: "올바른 이메일 양식이 아닙니다.",
//               },
//             ]}
//             validateTrigger="onBlur"
//           >
//             <Input placeholder="이메일 입력" />
//           </Form.Item>
//         </div>
//         <div className="w-full h-px bg-zinc-200 my-[20px]"></div>
//         <div className="flex gap-2 flex-col">
//           <Form.Item
//             name="name"
//             rules={[
//               {
//                 whitespace: true,

//                 message: "이름은 필수로 입력해야 합니다.",
//               },
//             ]}
//           >
//             <Input placeholder="이름" />
//           </Form.Item>

//           <Form.Item
//             name="birthday"
//             rules={[
//               {
//                 message: "생년월일을 입력하세요.",
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   const birthDate = moment(value, "YYYY.MM.DD");
//                   if (!birthDate.isValid()) {
//                     return Promise.reject(new Error("올바른 날짜 형식이 아닙니다."));
//                   }
//                   const age = moment().diff(birthDate, "years");
//                   if (age < 14) {
//                     return Promise.reject(new Error("14세 미만은 가입이 불가능합니다."));
//                   }
//                   return Promise.resolve();
//                 },
//               }),
//             ]}
//           >
//             <Input placeholder="생년월일 8자리" maxLength="10" onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item
//             name="tel"
//             rules={[
//               {
//                 whitespace: true,

//                 type: "number",
//                 validator: validPhoneNumber,
//                 message: "올바른 전화번호 양식이 아닙니다.",
//               },
//             ]}
//             validateTrigger="onBlur"
//           >
//             <Input placeholder="휴대전회번호('-' 제외하고 입력)" onChange={handlePhoneNumberChange} maxLength="13" />
//           </Form.Item>
//           <Form.Item name="gender">
//             <Radio.Group buttonStyle="solid" className="w-full grid grid-cols-3 text-center">
//               <Radio.Button value="man" className="!rounded-l-md">
//                 남자
//               </Radio.Button>
//               <Radio.Button value="woman">여자</Radio.Button>
//               <Radio.Button value="none" className="!rounded-r-md">
//                 선택안함
//               </Radio.Button>
//             </Radio.Group>
//           </Form.Item>

//           {/* {showAuthenticationCodeField && (
//             <Form.Item
//               name="authenticationCode"
//               rules={[{ required: true, message: "인증번호를 입력하세요." }]}
//             >
//               <Input placeholder="인증번호 입력" />
//             </Form.Item>
//           )} */}
//         </div>
//         {/* <Form.Item className="mt-8">
//           <SubmitButton form={form}>인증 요청</SubmitButton>
//         </Form.Item> */}
//         <Button type="primary" htmlType="submit" block className="mt-8">
//           다음
//         </Button>
//       </Form>
//     </LoginForm>
//   );
// };

// export default JoinForm;

import React, { useState } from "react";
import LoginForm from "components/LoginForm";
import { Input, Button, Radio, Form, message } from "antd";
import moment from "moment";
import axios from "axios";

const JoinForm = ({ handleData, nextStep }) => {
  const [form] = Form.useForm();
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isAuthCodeFilled, setIsAuthCodeFilled] = useState(false);

  const validPhoneNumber = (phoneNumberInput, value) => {
    if (!value || !value.startsWith("010")) {
      return Promise.reject(new Error(phoneNumberInput.message));
    } else {
      return Promise.resolve();
    }
  };

  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const phoneNumber = value.replace(/\D/g, "");
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    form.setFieldsValue({ tel: formattedPhoneNumber });
  };

  const onFinish = values => {
    console.log("결과값: ", values);
    handleData(values);
    nextStep();
  };

  const handleInputChange = e => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, "");
    const formattedDate = formattedValue
      .split("")
      .reduce((acc, char, index) => (index === 4 || index === 6 ? acc + "." + char : acc + char), "");
    form.setFieldsValue({ birthday: formattedDate });
  };

  const handleFormChange = (changedValues, allValues) => {
    const isAllFieldsFilled = Object.keys(allValues).every(key => allValues[key]);
    setIsFormFilled(isAllFieldsFilled);
  };

  const handleAuthCodeChange = e => {
    const { value } = e.target;
    if (value.length === 6) {
      setIsAuthCodeFilled(true);
    } else {
      setIsAuthCodeFilled(false);
    }
  };

  const sendAuthCode = async () => {
    const phoneNumber = form.getFieldValue("tel").replace(/-/g, "");
    const name = form.getFieldValue("name");
    if (!phoneNumber || !name) {
      message.error("이름과 휴대전화 번호를 입력하세요.");
      return;
    }

    try {
      await axios.post("/send-sms", { phoneNumber, name });
      message.success("인증번호가 발송되었습니다.");
      setShowAuthenticationCodeField(true);
    } catch (error) {
      message.error("인증번호 발송에 실패했습니다.");
      setShowAuthenticationCodeField(true);
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
            name="confirm"
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
            name="birthday"
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
            <Input placeholder="생년월일 8자리" maxLength="10" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="tel"
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
              <Radio.Button value="man" className="!rounded-l-md">
                남자
              </Radio.Button>
              <Radio.Button value="woman">여자</Radio.Button>
              <Radio.Button value="none" className="!rounded-r-md">
                선택안함
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {showAuthenticationCodeField && (
            <Form.Item name="authenticationCode" rules={[{ required: true, message: "인증번호를 입력하세요." }]}>
              <Input placeholder="인증번호 입력" onChange={handleAuthCodeChange} maxLength="6" />
            </Form.Item>
          )}
        </div>
        <Form.Item className="mt-8">
          <Button
            type="primary"
            onClick={() => {
              if (isAuthCodeFilled) {
                form.submit(); // 폼 제출
              } else {
                sendAuthCode();
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
