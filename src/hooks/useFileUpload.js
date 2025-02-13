// fileUploadApi.js
import { useState } from "react";
import { useMessageApi } from "components/messaging/MessageProvider";
import axiosInstance from "apis/axiosConfig";

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messageApi = useMessageApi();

  // PreSigned URL 발급 API 호출 (axiosInstance 사용)
  const getPreSignedUrl = async file => {
    const requestBody = {
      name: file.name,
      size: file.size,
      contentType: file.type,
    };

    try {
      const response = await axiosInstance.post("/api/v1/temp-files/pre-signed-url", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting pre-signed URL:", error);
      throw error;
    }
  };

  // 파일 업로드 로직 (PreSigned URL 발급을 통해 파일 업로드 ID 획득)
  const uploadFileToServer = async file => {
    if (!file) {
      messageApi.error("유효한 파일을 선택해주세요.");
      return null;
    }

    try {
      setLoading(true);
      const data = await getPreSignedUrl(file);
      // 응답 구조: { content: { name, preSignedURL, fileId } }
      const fileUploadId = data?.content?.fileId;
      if (fileUploadId) {
        messageApi.success(`${file.name} 파일이 성공적으로 업로드 URL을 발급받았습니다.`);
        return { fileId: fileUploadId, preSignedURL: data.content.preSignedURL };
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

  const handleFileChange = async file => {
    if (beforeUpload(file)) {
      const newFileList = [file];
      setFileList(newFileList);
      // 미리보기 URL 생성
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const fileUploadResult = await uploadFileToServer(file);
      return fileUploadResult;
    }
    return null;
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
