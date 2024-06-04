import React, { useRef, useMemo, useState } from "react";
import { Input, Form, Button, Upload, message } from "antd";
import ReactQuill from "react-quill";
import { UploadOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useMessageApi } from "components/AppLayout";

const CommonForm = ({ formik, editorRef, isCheckboxChecked, setPendingImages, setDeletedImages }) => {
  const quillRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log("데이터 오나?", response.data);
      const fileUploadId = response.data?.data?.payload[0]?.fileUploadId;
      console.log("fileUploadId:", fileUploadId);
      useMessage.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId;
    } catch (error) {
      useMessage.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = info => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Only keep the latest file
    setFileList(newFileList);
    setPendingImages(newFileList.map(file => file.originFileObj));
  };

  const handleImageDelete = (quill, delta) => {
    if (!quill) return;
    const deletedImages = [];
    delta.ops.forEach(op => {
      if (op.delete) {
        const images = quill.root.querySelectorAll("img");
        images.forEach(img => {
          const src = img.getAttribute("src");
          if (src.startsWith("http")) {
            deletedImages.push(src);
          }
        });
      }
    });
    setDeletedImages(prevImages => [...prevImages, ...deletedImages]);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", () => {
      const file = input.files[0];
      setPendingImages(prevImages => [...prevImages, file]);
      const reader = new FileReader();
      reader.onload = e => {
        const imgUrl = e.target.result;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", imgUrl);
        editor.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["image"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        userOnly: true,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
  ];

  return (
    <div className="mt-[77px] ml-10 right-side">
      <Form.Item className="mb-8">
        <p>의뢰 제목</p>
        <Input
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
          placeholder="제목을 입력하세요"
        />
      </Form.Item>
      <Form.Item>
        <p>
          의뢰 내용<span>(100자 이상)</span>
        </p>
        <ReactQuill
          ref={el => {
            editorRef.current = el;
            quillRef.current = el;
          }}
          theme="snow"
          value={formik.values.content}
          onChange={(content, delta, source, editor) => {
            formik.setFieldValue("content", editor.getHTML());
            if (source === "user") {
              handleImageDelete(editor, delta);
            }
          }}
          modules={modules}
          formats={formats}
          className="custom-quill"
          placeholder="내용을 입력하세요"
        />
      </Form.Item>
      <Form.Item>
        <p>의뢰 문서 업로드</p>
        <Upload
          fileList={fileList}
          accept=".pdf,.doc,.docx,.hwp"
          beforeUpload={file => {
            const isSizeValid = file.size / 1024 / 1024 < 1024;
            if (!isSizeValid) {
              message.error("파일 크기는 1GB 이하이어야 합니다.");
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
          onChange={handleFileChange}
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              onSuccess("ok");
            }, 0);
          }}
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            파일 선택
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button className="mt-[40px] w-[150px]" type="primary" htmlType="submit" disabled={!isCheckboxChecked}>
          의뢰 요청하기
        </Button>
      </Form.Item>
    </div>
  );
};

export default CommonForm;
