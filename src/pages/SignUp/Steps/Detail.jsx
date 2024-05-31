import React, { useState } from "react";
import axios from "axios";
import LoginForm from "components/LoginForm";
import { Upload, Button, Form, Input } from "antd";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import { useMessageApi } from "components/AppLayout";

const { Dragger } = Upload;

// 사무실 번호 지역번호 하이픈 추가
const formatPhoneNumber = value => {
  if (!value) {
    return "";
  }
  value = value.replace(/[^0-9]/g, "");

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
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUploadId, setFileUploadId] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]); // 임시 파일 상태
  const messageApi = useMessageApi();

  const uploadToServer = async file => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      setLoading(true);
      const response = await axios.post(`http://api.simplelaw.co.kr/api/v1/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("데이터 오나?", response.data);
      const { fileUploadId } = response.data;
      setFileUploadId(fileUploadId);
      messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = info => {
    const newFileList = info.fileList.slice(-1); // 최신 파일만 유지
    setFileList(newFileList);

    if (info.file && info.file.status === "removed") {
      setPendingFiles([]);
    } else if (info.fileList) {
      setPendingFiles(info.fileList.map(file => file.originFileObj)); // 임시 파일 리스트에 저장
    }
  };

  const handleSubmit = async () => {
    if (pendingFiles.length === 0) {
      messageApi.error("파일을 업로드해 주세요.");
      return;
    }
    for (let file of pendingFiles) {
      await uploadToServer(file);
    }
    setPendingFiles([]); // 제출 후 임시 파일 리스트 초기화
    setFileList([]); // 파일 리스트 초기화
    form.resetFields(); // 폼 필드 초기화
    nextStep(); // 다음 스텝으로 이동
  };

  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const formattedPhoneNumber = formatPhoneNumber(value);
    form.setFieldsValue({ companyPhone: formattedPhoneNumber });
  };

  const onFinish = async values => {
    console.log("결과값: ", values);
    await handleSubmit();
    handleData({ ...values, fileUploadId }); // fileUploadId를 포함한 데이터를 전달
    nextStep(); // 파일 업로드 없이 바로 다음 스텝으로 이동
  };

  const beforeUpload = file => {
    const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type);
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isValidType) {
      messageApi.error("png, jpg, jpeg, gif 파일만 업로드할 수 있습니다.");
    }

    if (!isLt10M) {
      messageApi.error("파일 크기는 10MB 이하만 가능합니다.");
    }

    return isValidType && isLt10M;
  };

  return (
    <LoginForm title="변호사 회원가입">
      <Form className="flex gap-[20px] flex-col" form={form} name="validateOnly" autoComplete="off" onFinish={onFinish}>
        <div className="flex gap-2 flex-col">
          <p className="font-medium text-base">소속</p>
          <Form.Item
            name="companyName"
            rules={[
              {
                required: true,
                message: "소속을 입력해 주세요.",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="소속(사무소,회사)" />
          </Form.Item>
          <Form.Item
            name="companyPhone"
            rules={[
              {
                required: true,
                message: "소속 전화번호를 입력해 주세요.",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="소속 전화번호(‘-’ 제외하고 입력)" onChange={handlePhoneNumberChange} maxLength="13" />
          </Form.Item>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="font-medium text-base">출신 시험</p>
          <Form.Item
            name="barExam"
            rules={[
              {
                required: true,
                message: "출신 시험을 입력해 주세요.",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="출신 시험" />
          </Form.Item>
          <Form.Item
            name="barExamCount"
            rules={[
              {
                required: true,
                message: "시험 횟수를 입력해 주세요.",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="시험 횟수" />
          </Form.Item>

          <Form.Item
            name="yearOfPassing"
            rules={[
              {
                required: true,
                message: "변호사 자격 획득연도를 입력해 주세요.",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="변호사 자격 획득연도" maxLength={4} />
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
            name="fileUploadId"
            rules={[
              {
                required: true,
                message: "파일을 업로드해 주세요.",
              },
            ]}
          >
            <Dragger
              name="files"
              multiple={false}
              fileList={fileList}
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              onChange={handleChange}
              disabled={loading}
            >
              <p className="mb-[8px]">
                <UploadFile className="mx-auto my-auto mt-[10px]" />
              </p>
              <p className="ant-upload-hint text-Btn-Text-Disabled text-sm font-normal mb-[10px]">
                최대 10mb 이하 png, jpg, jpeg, gif
              </p>
            </Dragger>
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block className="mt-8" disabled={loading}>
          다음
        </Button>
      </Form>
    </LoginForm>
  );
};

export default Detail;
