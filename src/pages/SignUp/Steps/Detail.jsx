import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import LoginForm from "components/layout/AuthFormLayout";
import { Button, Form, Input } from "antd";
import { useMessageApi } from "components/messaging/MessageProvider";
import { uploadFile } from "apis/commonAPI";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import SvgTrash from "components/Icons/Trash";
import { AiOutlinePaperClip } from "react-icons/ai";
import { detailFormSchema } from "utils/validations";

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
  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(detailFormSchema),
    mode: "onBlur",
  });
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
      setValue("fileUploadId", fileUploadId); // 파일 업로드 ID 설정
      trigger("fileUploadId"); // 폼 상태 업데이트
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
      uploadToServer(file); // 파일 업로드 및 ID 설정
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setValue("fileUploadId", ""); // 파일 업로드 ID 초기화
    trigger("fileUploadId"); // 폼 상태 업데이트
  };

  const handlePhoneNumberChange = e => {
    const { value } = e.target;
    const formattedPhoneNumber = formatPhoneNumber(value);
    setValue("companyPhone", formattedPhoneNumber);
    trigger("companyPhone"); // 폼 상태 업데이트
  };

  const handleNumberChange = (fieldName, e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setValue(fieldName, numericValue);
    trigger(fieldName); // 폼 상태 업데이트
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

  return (
    <LoginForm title='변호사 회원가입'>
      <Form className='flex gap-[20px] flex-col' onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <p className='font-medium text-base'>소속</p>
          <Form.Item validateStatus={errors.companyName ? "error" : ""} help={errors.companyName?.message}>
            <Controller
              name='companyName'
              control={control}
              render={({ field }) => <Input placeholder='소속(사무소,회사)' {...field} />}
            />
          </Form.Item>
          <Form.Item validateStatus={errors.companyPhone ? "error" : ""} help={errors.companyPhone?.message}>
            <Controller
              name='companyPhone'
              control={control}
              render={({ field }) => (
                <Input placeholder='소속 전화번호(‘-’ 제외하고 입력)' {...field} onChange={handlePhoneNumberChange} />
              )}
            />
          </Form.Item>
        </div>
        <div className='flex gap-2 flex-col'>
          <p className='font-medium text-base'>출신 시험</p>
          <Form.Item validateStatus={errors.barExam ? "error" : ""} help={errors.barExam?.message}>
            <Controller
              name='barExam'
              control={control}
              render={({ field }) => <Input placeholder='출신 시험' {...field} />}
            />
          </Form.Item>
          <Form.Item validateStatus={errors.barExamCount ? "error" : ""} help={errors.barExamCount?.message}>
            <Controller
              name='barExamCount'
              control={control}
              render={({ field }) => (
                <Input placeholder='시험 횟수' {...field} onChange={e => handleNumberChange("barExamCount", e)} />
              )}
            />
          </Form.Item>
          <Form.Item validateStatus={errors.yearOfPassing ? "error" : ""} help={errors.yearOfPassing?.message}>
            <Controller
              name='yearOfPassing'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder='변호사 자격 획득연도'
                  maxLength={4}
                  {...field}
                  onChange={e => handleNumberChange("yearOfPassing", e)}
                />
              )}
            />
          </Form.Item>
        </div>
        <Form.Item validateStatus={errors.fileUploadId ? "error" : ""} help={errors.fileUploadId?.message}>
          <Controller
            name='fileUploadId'
            control={control}
            render={({ field }) => (
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
            )}
          />
        </Form.Item>
        <Button type='primary' htmlType='submit' block disabled={!isValid || loading}>
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
