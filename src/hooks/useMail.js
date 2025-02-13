import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMessageApi } from "components/messaging/MessageProvider";
import { getMailById, updateMail } from "apis/mailsApi";
import { addReply, createMail } from "../redux/actions/mailActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "./useFileUpload";

export const useMail = (id, mode) => {
  const [pendingFiles, setPendingFiles] = useState([]);
  const { uploadFileToServer } = useFileUpload();
  const [existingMail, setExistingMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 초기 폼 값에 카테고리, 작업기한, 결제금액, 업로드된 파일 목록 추가
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      categoryKey: "", // 메인 카테고리
      categoryDetailKey: "", // 세부 카테고리
      due: "", // 의뢰 작업 기한 (ISO 문자열)
      amount: 50000, // 결제 금액
      isCheckboxChecked: false,
      uploadedFiles: [], // { fileId, name } 객체 배열
    },
    onSubmit: async values => {
      // pendingFiles에 있는 파일들을 서버에 업로드하여 { fileId, name } 배열을 반환
      const uploadedFiles = await uploadFilesToServer();

      const dataToSend = {
        category: {
          main: values.categoryKey,
          sub: values.categoryDetailKey,
        },
        title: values.title,
        content: values.content,
        due: values.due,
        amount: values.amount,
        files: uploadedFiles || [],
      };

      try {
        if (mode === "reply") {
          console.log("dataToSend", dataToSend);
          await dispatch(addReply(id, dataToSend));
          await updateMail(id, { status: "resolved" });
          messageApi.success("답변이 등록되었습니다!");
        } else {
          await dispatch(createMail(dataToSend)); // createMail 내부에서 /api/v1/clients/instances 호출
          messageApi.success("게시글이 등록되었습니다!");
        }
        formik.resetForm();
        navigate("/request");
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
        categoryKey: existingMail.category?.main || "",
        categoryDetailKey: existingMail.category?.sub || "",
        due: existingMail.due || "",
        amount: existingMail.amount || 0,
        isCheckboxChecked: existingMail.isCheckboxChecked || false,
        content: existingMail.content || "",
        uploadedFiles: existingMail.files || [],
      });
    }
  }, [existingMail, formik]);

  // pendingFiles 배열의 파일들을 순차적으로 업로드
  const uploadFilesToServer = async () => {
    const uploadedFilesArray = [];
    for (const file of pendingFiles) {
      try {
        // uploadFileToServer는 PreSigned URL 요청 및 PUT 업로드 후 { fileId, name } 반환
        const fileUploadResult = await uploadFileToServer(file);
        if (fileUploadResult && fileUploadResult.fileId) {
          uploadedFilesArray.push({
            fileId: fileUploadResult.fileId,
            name: file.name, // 혹은 fileUploadResult.name (API 응답 구조에 따라)
          });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return uploadedFilesArray;
  };

  return {
    formik,
    loading,
    existingMail,
    setPendingFiles,
  };
};
