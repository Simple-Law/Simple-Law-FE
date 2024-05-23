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
          onChange={(content, delta, source, editor) => formik.setFieldValue("content", editor.getHTML())}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "code-block",
            "list",
            "bullet",
            "script",
            "indent",
            "direction",
            "size",
            "header",
            "color",
            "background",
            "font",
            "align",
            "link",
            "image",
          ]}
        />
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
