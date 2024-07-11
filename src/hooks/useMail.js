import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMessageApi } from "components/messaging/MessageProvider";
import { deleteFile, uploadFile } from "apis/commonAPI";
import { getMailById } from "apis/mailsApi";
import { addReply, createMail } from "../redux/actions/mailActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const useMail = (id, mode, user, editorRef) => {
  const [pendingImages, setPendingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [existingMail, setExistingMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      time: "",
      status: "preparing",
      isCheckboxChecked: false,
    },
    onSubmit: async values => {
      await deleteImagesFromServer();
      const imageUrls = await uploadImagesToServer();
      const contentWithImages = editorRef.current
        .getEditor()
        .root.innerHTML.replace(/<img src="data:([^"]*)">/g, (match, p1, offset, string) => {
          const url = imageUrls.shift();
          return `<img src="${url}">`;
        });

      const currentTime = new Date().toISOString();
      const dataToSend = {
        ...values,
        content: contentWithImages,
        status: values.status || "preparing",
        sentAt: currentTime,
        userId: user.id,
        userName: user.name,
        userType: user.type,
      };

      try {
        if (mode === "reply") {
          console.log("dataToSend", dataToSend);
          await dispatch(addReply(id, dataToSend));
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
          formik.setValues({
            ...formik.values,
            title: mailData.title || "",
            category: mailData.category || "",
            time: mailData.time || "",
            status: mailData.status || "preparing",
            isCheckboxChecked: mailData.isCheckboxChecked || false,
          });
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
    setDeletedImages,
  };
};
