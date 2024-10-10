import { useState } from "react";
import { useMessageApi } from "components/messaging/MessageProvider";
import { uploadFile } from "apis/commonAPI";

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messageApi = useMessageApi();

  const uploadFileToServer = async file => {
    if (!file) {
      messageApi.error("유효한 파일을 선택해주세요.");
      return null;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      setLoading(true);
      const response = await uploadFile(formData);
      const fileUploadId = response?.data?.payload[0]?.fileUploadId;
      if (fileUploadId) {
        messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
        return fileUploadId;
      } else {
        throw new Error("파일 업로드 ID를 가져오지 못했습니다.");
      }
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async file => {
    if (beforeUpload(file)) {
      const newFileList = [file];
      setFileList(newFileList);

      // 미리보기 URL 생성
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const fileUploadId = await uploadFileToServer(file);
      return fileUploadId;
    }
    return null;
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
  const handleRemove = () => {
    setFileList([]);
    setPreviewUrl(null); // 미리보기 URL 초기화
  };

  return {
    loading,
    fileList,
    setFileList,
    handleFileChange,
    handleRemove,
    uploadFileToServer,
    previewUrl,
  };
};
