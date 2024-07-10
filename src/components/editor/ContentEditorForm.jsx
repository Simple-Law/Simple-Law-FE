import { useRef, useMemo, useState, useCallback } from "react";
import { Input, Form, Button, Upload } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMessageApi } from "components/messaging/MessageProvider";
import styled from "styled-components";

// eslint-disable-next-line react/prop-types
const CommonForm = ({ formik, editorRef, setPendingImages, setDeletedImages }) => {
  const quillRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const messageApi = useMessageApi();

  const handleFileChange = info => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Only keep the latest file
    setFileList(newFileList);
    setPendingImages(newFileList.map(file => file.originFileObj));
  };

  const handleImageDelete = delta => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !delta.ops) return;
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

  const imageHandler = useCallback(() => {
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
  }, [setPendingImages]);

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
    [imageHandler],
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
    <StyledFormContainer>
      <Form.Item className='mb-8'>
        <p>의뢰 제목</p>
        <Input
          name='title'
          onChange={formik.handleChange}
          value={formik.values.title}
          placeholder='제목을 입력하세요'
        />
      </Form.Item>
      <Form.Item>
        <p>
          의뢰 내용<span>(100자 이상)</span>
        </p>
        <StyledQuillContainer>
          <ReactQuill
            ref={quillRef}
            theme='snow'
            value={formik.values.content}
            onChange={(content, delta, source, editor) => {
              formik.setFieldValue("content", editor.getHTML());
              if (source === "user") {
                handleImageDelete(delta);
              }
            }}
            modules={modules}
            formats={formats}
            className='custom-quill'
            placeholder='내용을 입력하세요'
          />
        </StyledQuillContainer>
      </Form.Item>
      <Form.Item>
        <StyledUploadContainer>
          <p>의뢰 문서 업로드</p>
          <StyledUploadContent>
            <Upload
              fileList={fileList}
              accept='.pdf,.doc,.docx,.hwp'
              beforeUpload={file => {
                const isSizeValid = file.size / 1024 / 1024 < 1024;
                if (!isSizeValid) {
                  messageApi.error("파일 크기는 1GB 이하이어야 합니다.");
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
              <StyledButton icon={<PaperClipOutlined />}>파일 선택</StyledButton>
            </Upload>
            <p>1GB 이하 (hwp, word, pdf)</p>
          </StyledUploadContent>
        </StyledUploadContainer>
      </Form.Item>
      <Form.Item>
        <Button className='mt-[40px] w-[150px]' type='primary' htmlType='submit'>
          의뢰 요청하기
        </Button>
      </Form.Item>
    </StyledFormContainer>
  );
};

const StyledFormContainer = styled.div`
  margin-left: 45px;
  width: calc(100% - 510px);
  .ant-form-item {
    margin-bottom: 16px;
  }

  p {
    font-weight: bold;
  }
`;

const StyledQuillContainer = styled.div`
  .custom-quill {
    img {
      max-width: 100%;
      height: auto;
    }
  }
`;

const StyledUploadContainer = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;
  p {
    margin-bottom: 0 !important;
  }
`;

const StyledUploadContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  p {
    color: #94a3b8;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;

    letter-spacing: -0.28px;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 4px;
  border: 1px solid #e3e9ee;
  padding: 6px 12px 6px 8px;
  color: #171717;
  &:hover {
    color: #40a9ff;
  }
`;

export default CommonForm;
