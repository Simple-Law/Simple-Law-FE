import PropTypes from "prop-types";
import { useRef, useState, useEffect, useCallback } from "react";
import { Input, Form, Button, Upload } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMessageApi } from "components/messaging/MessageProvider";
import styled from "styled-components";

const CommonForm = ({ formik, editorRef, setPendingImages, setPendingFiles, setDeletedImages, mode }) => {
  const quillRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const messageApi = useMessageApi();

  const handleFileChange = info => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
    setPendingFiles(newFileList.map(file => file.originFileObj)); // 문서 첨부 파일 설정
  };

  const handleImageDelete = useCallback(
    mutationsList => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;
      const deletedImages = [];
      mutationsList.forEach(mutation => {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            if (node.tagName === "IMG" && node.src.startsWith("http")) {
              deletedImages.push(node.src);
            }
          });
        }
      });
      setDeletedImages(prevImages => [...prevImages, ...deletedImages]);
    },
    [setDeletedImages],
  );

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const observer = new MutationObserver(handleImageDelete);
    observer.observe(quill.root, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [handleImageDelete]);

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

  const handleChange = (content, delta, source, editor) => {
    formik.setFieldValue("content", editor.getHTML());
  };

  const modules = {
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
  };

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
      {mode !== "reply" && (
        <Form.Item className='mb-8'>
          <p>의뢰 제목</p>
          <Input
            name='title'
            onChange={formik.handleChange}
            value={formik.values.title}
            placeholder='제목을 입력하세요'
          />
        </Form.Item>
      )}
      <Form.Item>
        <p>
          {mode === "reply" ? "답변 달기" : "의뢰 내용"}
          <span>(100자 이상)</span>
        </p>
        <StyledQuillContainer>
          <ReactQuill
            ref={el => {
              editorRef.current = el;
              quillRef.current = el;
            }}
            theme='snow'
            value={formik.values.content}
            onChange={handleChange}
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
          {mode === "reply" ? "답변하기" : "의뢰 요청하기"}
        </Button>
      </Form.Item>
    </StyledFormContainer>
  );
};

CommonForm.propTypes = {
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      isCheckboxChecked: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  editorRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  setPendingImages: PropTypes.func.isRequired,
  setPendingFiles: PropTypes.func.isRequired, // 문서 첨부 파일 설정 함수 추가
  setDeletedImages: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default CommonForm;

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
