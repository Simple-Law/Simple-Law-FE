import React, { useEffect, useState } from "react";
import LoginForm from "components/LoginForm";
import { Form, Input, Upload, message, Button } from "antd";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import SubmitButton from "components/SubmitButton";
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
const Detail = () => {
  const [form] = Form.useForm();

  const [clientReady, setClientReady] = useState(false);
  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);
  const handleChange = (fieldName, inputValue) => {
    let newValue = inputValue.replace(/\D/g, "");
    if (fieldName === "officetel") {
      newValue = newValue.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }
    // Form.Item의 값을 업데이트
    form.setFieldsValue({
      [fieldName]: newValue,
    });
  };
  const onFinish = (values) => {
    console.log("결과값: ", values);
  };
  return (
    <LoginForm title="변호사 회원가입">
      <Form
        className="flex gap-[20px] flex-col"
        form={form}
        name="validateOnly"
        autoComplete="off"
        onFinish={onFinish}
      >
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
              onChange={(e) => handleChange("officetel", e.target.value)}
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
            <Input
              placeholder="시험 횟수"
              onChange={(e) => handleChange("number", e.target.value)}
            />
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
              onChange={(e) => handleChange("year", e.target.value)}
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

        <Form.Item shouldUpdate>
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
        </Form.Item>
      </Form>
    </LoginForm>
  );
};

export default Detail;
