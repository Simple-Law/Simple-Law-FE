// src/components/CommonForm.js
import React from "react";
import { Input, Form, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CommonForm = ({ formik, editorRef, isCheckboxChecked }) => {
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
          ref={editorRef}
          theme="snow"
          value={formik.values.content}
          onChange={(content, delta, source, editor) =>
            formik.setFieldValue("content", editor.getHTML())
          }
          modules={{
            toolbar: [
              [{ size: ["small", false, "large", "huge"] }],
              [{ align: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [
                {
                  color: [],
                },
                { background: [] },
              ],
            ],
          }}
          formats={[
            "font",
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "align",
            "color",
            "background",
            "size",
            "h1",
          ]}
          className="custom-quill"
          placeholder="내용을 입력하세요"
        />
      </Form.Item>
      <Form.Item>
        <Button
          className="mt-[40px] w-[150px]"
          type="primary"
          htmlType="submit"
          disabled={!isCheckboxChecked}
        >
          의뢰 요청하기
        </Button>
      </Form.Item>
    </div>
  );
};

export default CommonForm;
