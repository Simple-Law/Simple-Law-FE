import React, { useEffect, useState } from "react";
import LoginForm from "components/LoginForm";
import { Input, Button, Radio, Form } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button block type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};
const JoinForm = () => {
  // const { type } = useParams();
  const [form] = Form.useForm();
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const validPhoneNumber = (phoneNumberInput, value) => {
    if (!value || !value.startsWith("010")) {
      return Promise.reject(new Error(phoneNumberInput.message));
    } else {
      return Promise.resolve();
    }
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;

    // 입력된 문자열에서 숫자만 추출하여 구성
    const phoneNumber = value.replace(/\D/g, "");

    // 전화번호 형식에 맞게 '-' 추가
    const formattedPhoneNumber = phoneNumber.replace(
      /(\d{3})(\d{3,4})(\d{4})/,
      "$1-$2-$3"
    );

    // 폼 필드에 값을 설정
    form.setFieldsValue({ tel: formattedPhoneNumber });
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const disabledDate = (current) => {
    // 현재 날짜에서 14년 전 날짜를 구함
    const fourteenYearsAgo = moment().subtract(14, "years");

    // 현재 날짜보다 이전인 경우만 비활성화
    return current && current > fourteenYearsAgo.endOf("day");
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    // 숫자 이외의 문자 제거
    const formattedValue = value.replace(/\D/g, "");

    // 구분자를 추가하여 출력
    const formattedDate = formattedValue
      .split("")
      .reduce(
        (acc, char, index) =>
          index === 4 || index === 6 ? acc + "." + char : acc + char,
        ""
      );

    // 폼 필드에 값을 설정
    form.setFieldsValue({ birthday: formattedDate });
  };
  return (
    <LoginForm title="회원가입">
      <Form form={form} onFinish={onFinish} autoComplete="off">
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
          >
            <Input placeholder="아이디 입력" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ whitespace: true, required: true }]}
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
                  return Promise.reject(
                    new Error("비밀번호가 일치하지 않습니다.")
                  );
                },
              }),
            ]}
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
                message: "아이디를 이메일 형태로 입력해주세요",
              },
            ]}
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

          {/* <Form.Item
            name="birthday"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker placeholder="생년월일 8자리" disabledDate={disabledDate} />
          </Form.Item> */}
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
                    return Promise.reject(
                      new Error("올바른 날짜 형식이 아닙니다.")
                    );
                  }
                  const age = moment().diff(birthDate, "years");
                  if (age < 14) {
                    return Promise.reject(
                      new Error("14세 미만은 가입이 불가능합니다.")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="생년월일 8자리"
              maxLength="10"
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="tel"
            rules={[
              {
                whitespace: true,
                required: true,

                type: "number",
                validator: validPhoneNumber,
                message: "올바른 전화번호 양식이 아닙니다.",
              },
            ]}
          >
            <Input
              placeholder="휴대전회번호('-' 제외하고 입력)"
              onChange={handlePhoneNumberChange}
              maxLength="13"
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              buttonStyle="solid"
              className="w-full grid grid-cols-3 text-center"
            >
              <Radio.Button value="man">남자</Radio.Button>
              <Radio.Button value="woman">여자</Radio.Button>
              <Radio.Button value="none">선택안함</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-hint">최대 10mb이하 png,jpg,jpge,gif</p>
            </Upload.Dragger>
          </Form.Item> */}
        </div>
        <Form.Item className="mt-8">
          <SubmitButton
            type="primary"
            htmlType="submit"
            block
            className="mt-8 w-full"
            form={form}
          >
            인증 요청
          </SubmitButton>
        </Form.Item>
      </Form>
    </LoginForm>
  );
};

export default JoinForm;
