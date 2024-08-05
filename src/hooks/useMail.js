import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMessageApi } from "components/messaging/MessageProvider";
import { uploadFile } from "apis/commonAPI";
import { getMailById, updateMail } from "apis/mailsApi";
import { addReply, createMail } from "../redux/actions/mailActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useMail = (id, mode) => {
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
      const fileUploadIdList = await uploadFilesToServer(); // 문서 첨부 파일 업로드

      const dataToSend = {
        categoryKey: values.categoryKey,
        title: values.title,

        content: values.content,
        fileUploadIdList: fileUploadIdList || [],
      };

      try {
        if (mode === "reply") {
          console.log("dataToSend", dataToSend);
          await dispatch(addReply(id, dataToSend));
          await updateMail(id, { status: "resolved" });
          messageApi.success("답변이 등록되었습니다!");
        } else {
          await dispatch(createMail(dataToSend));
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

  return {
    formik,
    loading,
    existingMail,
    setPendingFiles, // 문서 첨부 파일 상태 설정 함수 추가
  };
};
