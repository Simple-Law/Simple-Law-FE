import React, { useState } from "react";
import axios from "axios";
import { Upload, Button, Form } from "antd";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import { useMessageApi } from "components/AppLayout";

const { Dragger } = Upload;
// 이미지 업로드 테스터
const ImgUpload = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]); // 추가: 임시 파일 상태
  const useMessage = useMessageApi();

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      console.log("데이터 오나?", response.data); // 서버 응답 구조 확인을 위한 로그
      const fileUploadId = response.data?.data?.payload[0]?.fileUploadId; // 서버 응답에서 fileUploadId 추출
      console.log("fileUploadId:", fileUploadId); // fileUploadId 확인
      useMessage.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId; // 추가: 업로드된 파일 ID 반환
    } catch (error) {
      useMessage.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = info => {
    const newFileList = info.fileList;
    setFileList(newFileList);
    setPendingFiles(newFileList.map(file => file.originFileObj)); // 추가: 임시 파일 리스트에 저장
  };

  const handleSubmit = async () => {
    if (pendingFiles.length === 0) {
      useMessage.error("파일을 업로드해 주세요.");
      return;
    }
    const currentDate = getCurrentDate();
    for (let file of pendingFiles) {
      const fileUploadId = await uploadToServer(file);
      console.log("fileUploadId after uploadToServer:", fileUploadId); // fileUploadId 확인
      if (fileUploadId) {
        const fileUrl = `https://prod-simplelaw-api-server-bucket.s3.ap-northeast-2.amazonaws.com/TEMP/${currentDate}/${fileUploadId}.jpg`;
        console.log("Uploaded file URL:", fileUrl); // 파일 URL 출력 (필요에 따라 처리)
      }
    }
    setPendingFiles([]); // 제출 후 임시 파일 리스트 초기화
    setFileList([]); // 파일 리스트 초기화
    form.resetFields(); // 폼 필드 초기화
  };

  return (
    <Form form={form} name="validateOnly" autoComplete="off" className="flex gap-[20px] flex-col">
      <div className="flex gap-2 flex-col">
        <p className="font-medium text-base flex items-center">
          파일 업로드
          <label
            htmlFor="file-upload"
            className="bg-slate-400 rounded text-white text-xs font-medium leading-none px-2 py-1 ml-[10px]"
          >
            내 PC
          </label>
        </p>
        <Form.Item
          name="identification"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[{ required: true, message: "파일을 업로드해 주세요." }]}
        >
          <Dragger
            name="files"
            multiple={true} // 다중 파일 업로드를 허용하도록 수정
            fileList={fileList}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onChange={handleChange}
            disabled={loading}
            accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.hwp" // 허용할 파일 유형 추가
          >
            <p className="mb-[8px]">
              <UploadFile className="mx-auto my-auto mt-[10px]" />
            </p>
            <p className="ant-upload-hint text-Btn-Text-Disabled text-sm font-normal mb-[10px]">
              최대 10mb 이하 png, jpg, jpeg, gif, pdf, doc, docx, hwp 파일을 업로드할 수 있습니다.
            </p>
          </Dragger>
        </Form.Item>
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        block
        className="mt-8"
        disabled={pendingFiles.length === 0 || loading}
      >
        제출하기
      </Button>
    </Form>
  );
};

export default ImgUpload;
