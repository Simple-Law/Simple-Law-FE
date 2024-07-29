import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMessageApi } from "components/messaging/MessageProvider";
import { deleteFile, uploadFile } from "apis/commonAPI"; // 경로를 확인하세요
import { getMailById, updateMail } from "apis/mailsApi"; // 경로를 확인하세요
import { addReply, createMail } from "../redux/actions/mailActions"; // 경로를 확인하세요
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useMail = (id, mode, user, editorRef) => {
  const [pendingImages, setPendingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [existingMail, setExistingMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      categoryKey: "", // categoryKey를 추가
      time: "",
      status: "preparing",
      isCheckboxChecked: false,
    },
    onSubmit: async values => {
      await deleteImagesFromServer();
      const imageUrls = await uploadImagesToServer();
      const fileUploadIdList = await uploadFilesToServer(); // 문서 첨부 파일 업로드

      const contentWithImages = editorRef.current
        .getEditor()
        .root.innerHTML.replace(/<img src="data:([^"]*)">/g, (match, p1, offset, string) => {
          const url = imageUrls.shift();
          return `<img src="${url}">`;
        });

      const dataToSend = {
        categoryKey: values.categoryKey,
        title: values.title,
        content: contentWithImages,
        fileUploadIdList: fileUploadIdList || [],
      };

      try {
        if (mode === "reply") {
          console.log("dataToSend", dataToSend);
          await dispatch(addReply(id, dataToSend));
          await updateMail(id, { status: "resolved" });
          messageApi.success("답변이 등록되었습니다!");
        } else {
          console.log("👉dataToSend", dataToSend);
          const response = await dispatch(createMail(dataToSend));
          console.log("Response:", response);
          messageApi.success("게시글이 등록되었습니다!");
        }
        formik.resetForm();
        navigate("/board");
      } catch (error) {
        messageApi.error("작업에 실패했습니다!");
        console.error("Error sending mail:", error);
      }
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const loadMail = async id => {
      if (id) {
        try {
          const mailData = await getMailById(id);
          setExistingMail(mailData);
        } catch (error) {
          console.error("Error fetching mail:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    if (mode === "reply") {
      loadMail(id);
    } else {
      setLoading(false);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [id, mode]);

  useEffect(() => {
    if (existingMail) {
      formik.setValues({
        title: existingMail.title || "",
        category: existingMail.category || "",
        time: existingMail.time || "",
        status: "preparing",
        isCheckboxChecked: existingMail.isCheckboxChecked || false,
      });
    }
  }, [existingMail]);

  const uploadImagesToServer = async () => {
    const imageUrls = [];
    const currentDate = new Date().toISOString().split("T")[0];
    for (const file of pendingImages) {
      const fileUploadId = await uploadToServer(file);
      if (fileUploadId) {
        const fileUrl = `https://prod-simplelaw-api-server-bucket.s3.ap-northeast-2.amazonaws.com/TEMP/${currentDate}/${fileUploadId}.jpg`;
        imageUrls.push(fileUrl);
      }
    }
    return imageUrls;
  };

  const uploadToServer = async file => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadFile(formData);
      const fileUploadId = response?.data?.payload[0]?.fileUploadId;
      messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId;
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const uploadFilesToServer = async () => {
    const fileUploadIdList = [];
    for (const file of pendingFiles) {
      try {
        const fileUploadId = await uploadFileToServer(file);
        if (fileUploadId) {
          fileUploadIdList.push(fileUploadId);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return fileUploadIdList;
  };

  const uploadFileToServer = async file => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadFile(formData);
      const fileUploadId = response?.data?.payload[0]?.fileUploadId;
      console.log("Uploaded file ID:", fileUploadId); // 업로드된 파일 ID 출력
      messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId;
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const deleteImagesFromServer = async () => {
    for (const url of deletedImages) {
      try {
        await deleteFile(url);
        console.log("Image deleted:", url);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  return {
    formik,
    loading,
    existingMail,
    setPendingImages,
    setPendingFiles, // 문서 첨부 파일 상태 설정 함수 추가
    setDeletedImages,
  };
};
