import React, { useState } from "react";
import axios from "axios";
import { Upload, Button, Form } from "antd";
import { ReactComponent as UploadFile } from "assets/images/icons/Upload.svg";
import { useMessageApi } from "components/AppLayout";

const { Dragger } = Upload;

const ImgUpload = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUploadId, setFileUploadId] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]); // 추가: 임시 파일 상태
  const useMessage = useMessageApi();

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
      useMessage.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
    } catch (error) {
      useMessage.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = info => {
    const newFileList = (info.fileList || []).slice(-1); // 최신 파일만 유지
    setFileList(newFileList);
    if (info.file.status === "removed") {
      setPendingFiles([]);
    } else {
      setPendingFiles(info.fileList.map(file => file.originFileObj)); // 추가: 임시 파일 리스트에 저장
    }
  };

  const handleSubmit = async () => {
    if (pendingFiles.length === 0) {
      useMessage.error("파일을 업로드해 주세요.");
      return;
    }
    for (let file of pendingFiles) {
      await uploadToServer(file);
    }
    setPendingFiles([]); // 제출 후 임시 파일 리스트 초기화
    setFileList([]); // 파일 리스트 초기화
    form.resetFields(); // 폼 필드 초기화
  };

  return (
    <Form form={form} name="validateOnly" autoComplete="off" className="flex gap-[20px] flex-col">
      <div className="flex gap-2 flex-col">
        <p className="font-medium text-base flex items-center">
          사진 업로드
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
            multiple={false}
            fileList={fileList}
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
