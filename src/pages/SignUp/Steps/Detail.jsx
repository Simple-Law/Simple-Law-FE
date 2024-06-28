import { useState, useRef } from "react";
import PropTypes from "prop-types";
import LoginForm from "components/layout/AuthFormLayout";
import { Button, Form, Input } from "antd";
import { useMessageApi } from "components/messaging/MessageProvider";
import { uploadFile } from "apis/commonAPI";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import SvgTrash from "components/Icons/Trash";
import { AiOutlinePaperClip } from "react-icons/ai";

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
  const messageApi = useMessageApi();
  const dropAreaRef = useRef(null);

  const uploadToServer = async file => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      setLoading(true);
      const response = await uploadFile(formData);
      const fileUploadId = response?.data?.payload[0]?.fileUploadId; // 서버 응답에서 fileUploadId 추출
      messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId;
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = file => {
    if (beforeUpload(file)) {
      const newFileList = [file]; // 최신 파일만 유지
      setFileList(newFileList);
    }
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const formattedPhoneNumber = formatPhoneNumber(value);
    form.setFieldsValue({ companyPhone: formattedPhoneNumber });
  };

  const handleNumberChange = (fieldName, e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    form.setFieldsValue({ [fieldName]: numericValue });
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      messageApi.error("파일을 업로드해 주세요.");
      return false;
    }
    const fileUploadId = await uploadToServer(fileList[0]);
    return fileUploadId;
  };

  const onFinish = async values => {
    setLoading(true);
    const fileUploadId = await handleSubmit();
    setLoading(false);
    if (fileUploadId) {
      handleData({ ...values, fileUploadId });
      nextStep();
    } else {
      messageApi.error("파일 업로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const beforeUpload = file => {
    const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type);
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isValidType) {
      messageApi.error("png, jpg, jpeg, gif 파일만 업로드할 수 있습니다.");
      return false;
    }

    if (!isLt10M) {
      messageApi.error("파일 크기는 10MB 이하만 가능합니다.");
      return false;
    }

    return true;
  };

  return (
    <LoginForm title='변호사 회원가입'>
      <Form className='flex gap-[20px] flex-col' form={form} name='validateOnly' autoComplete='off' onFinish={onFinish}>
        <div className='flex gap-2 flex-col'>
          <p className='font-medium text-base'>소속</p>
          <Form.Item
            name='companyName'
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
            <Input placeholder='소속(사무소,회사)' />
          </Form.Item>
          <Form.Item
            name='companyPhone'
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
            <Input placeholder='소속 전화번호(‘-’ 제외하고 입력)' onChange={handlePhoneNumberChange} maxLength='13' />
          </Form.Item>
        </div>
        <div className='flex gap-2 flex-col'>
          <p className='font-medium text-base'>출신 시험</p>
          <Form.Item
            name='barExam'
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
            <Input placeholder='출신 시험' />
          </Form.Item>
          <Form.Item
            name='barExamCount'
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
            <Input placeholder='시험 횟수' onChange={e => handleNumberChange("barExamCount", e)} />
          </Form.Item>

          <Form.Item
            name='yearOfPassing'
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
            <Input
              placeholder='변호사 자격 획득연도'
              maxLength={4}
              onChange={e => handleNumberChange("yearOfPassing", e)}
            />
          </Form.Item>
        </div>
        <Form.Item
          name='fileUploadId'
          rules={[
            {
              required: true,
              message: "파일을 업로드해 주세요.",
            },
          ]}
        >
          <div
            ref={dropAreaRef}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{ position: "relative" }}
          >
            <p className='font-medium text-base flex items-center'>
              변호사 신분증 사진 업로드
              <input
                type='file'
                id='file-upload'
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileChange(file);
                  }
                }}
              />
              <label
                htmlFor='file-upload'
                className='bg-slate-400 rounded text-white text-xs font-medium leading-none px-2 py-1 ml-[10px]'
                style={{ cursor: "pointer" }}
              >
                내 PC
              </label>
            </p>
            {fileList.length === 0 ? (
              <div className='h-[180px] text-center rounded-md border border-dashed border-gray-200 bg-gray-50 mt-2 flex flex-col items-center justify-center'>
                <UploadFile className='mx-auto' />
                <p className='ant-upload-hint text-Btn-Text-Disabled text-sm font-normal mb-[10px]'>
                  최대 10mb 이하 png, jpg, jpeg, gif
                </p>
              </div>
            ) : (
              <div className='border border-dashed border-gray-200 rounded-md p-2 bg-gray-50 mt-2'>
                {fileList.map((file, index) => (
                  <div key={index} className='flex justify-between items-center p-2 mb-2 '>
                    <div className='flex items-center'>
                      <AiOutlinePaperClip className='mr-2' />
                      <span className='text-sm text-gray-700'>{file.name}</span>
                    </div>
                    <Button type='link' onClick={handleRemove} className='p-0 '>
                      <SvgTrash width='15px' height='15px' />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Form.Item>
        <Button type='primary' htmlType='submit' block disabled={loading}>
          다음
        </Button>
      </Form>
    </LoginForm>
  );
};

Detail.propTypes = {
  handleData: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
};

export default Detail;
