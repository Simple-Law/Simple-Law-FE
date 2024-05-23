import React, { useEffect, useState } from "react";
import LoginForm from "components/LoginForm";
import { Form, Input, Upload, message, Button } from "antd";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
// import SubmitButton from "components/SubmitButton";
const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const formatPhoneNumber = value => {
  if (!value) {
    return "";
  }

  value = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

  let result = [];
  let restNumber = "";

  if (value.startsWith("02")) {
    // 서울 02 지역번호
    result.push(value.substr(0, 2));
    restNumber = value.substring(2);
  } else if (value.startsWith("1")) {
    // 지역 번호가 없는 경우 (ex. 1577-xxxx)
    restNumber = value;
  } else {
    // 나머지 3자리 지역번호 (ex. 031, 032)
    result.push(value.substr(0, 3));
    restNumber = value.substring(3);
  }

  if (restNumber.length === 7) {
    // 7자리만 남았을 때는 xxx-yyyy
    result.push(restNumber.substring(0, 3));
    result.push(restNumber.substring(3));
  } else {
    result.push(restNumber.substring(0, 4));
    result.push(restNumber.substring(4));
  }

  return result.filter(val => val).join("-");
};

const Detail = ({ handleData, nextStep }) => {
  const [form] = Form.useForm();

  const [clientReady, setClientReady] = useState(false);
  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);

  const handleChange = (fieldName, inputValue) => {
    let newValue = inputValue;
    if (fieldName === "officetel") {
      newValue = formatPhoneNumber(inputValue);
    }
    form.setFieldsValue({
      [fieldName]: newValue,
    });
  };

  const onFinish = values => {
    console.log("결과값: ", values);
    handleData(values);
    nextStep();
  };
  return (
    <LoginForm title="변호사 회원가입">
      <Form className="flex gap-[20px] flex-col" form={form} name="validateOnly" autoComplete="off" onFinish={onFinish}>
        <div className="flex gap-2 flex-col">
          <p className="font-medium text-base">소속</p>
          <Form.Item
            name="office"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="소속(사무소,회사)" />
          </Form.Item>
          <Form.Item
            name="officetel"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input
              placeholder=" 소속 전화번호(‘-’ 제외하고 입력)"
              onChange={e => handleChange("officetel", e.target.value)}
              maxLength="13"
            />
          </Form.Item>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="font-medium text-base">출신 시험</p>
          <Form.Item
            name="ancestry"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="출신 시험" />
          </Form.Item>
          <Form.Item
            name="number"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="시험 횟수" onChange={e => handleChange("number", e.target.value)} />
          </Form.Item>

          <Form.Item
            name="year"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input
              placeholder="변호사 자격 획득연도"
              maxLength={4}
              onChange={e => handleChange("year", e.target.value)}
            />
          </Form.Item>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="font-medium text-base flex items-center">
            변호사 신분증 사진 업로드
            <label
              htmlFor="file-upload"
              className="bg-slate-400 rounded text-white text-xs font-medium leading-none px-2 py-1 ml-[10px]"
            >
              내 PC
            </label>
          </p>
          <Form.Item
            name="identification"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Dragger {...props}>
              <p className="mb-[8px]">
                <UploadFile className="mx-auto my-auto mt-[10px]" />
              </p>

              <p className="ant-upload-hint text-Btn-Text-Disabled text-sm font-normal mb-[10px]">
                최대 10mb 이하 png, jpg, jpeg, gif
              </p>
            </Dragger>
          </Form.Item>
        </div>
        {/* <Form.Item>
          <SubmitButton className="mt-8" form={form}>
            다음
          </SubmitButton>
        </Form.Item> */}

        {/* <Form.Item shouldUpdate>
          {() => (
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={
                !clientReady ||
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              다음
            </Button>
          )}
        </Form.Item> */}
        <Button type="primary" htmlType="submit" block className="mt-8">
          다음
        </Button>
      </Form>
    </LoginForm>
  );
};

export default Detail;
