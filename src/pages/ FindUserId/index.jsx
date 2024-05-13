import React, { useState } from "react";
import axios from "axios";
import LoginForm from "components/LoginForm";
import { Button, Form, Input } from "antd";

const FindUserId = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const onFormFinish = async (values) => {
    setError("");
    setUserId("");
    try {
      const response = await axios.get("http://localhost:4000/users", {
        params: { name: values.name, email: values.email },
      });
      const user = response.data.find(
        (user) => user.name === values.name && user.email === values.email
      );

      if (user) {
        setUserId(user.userId);
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Error fetching user data");
    }
  };

  return (
    <LoginForm title="아이디 찾기">
      <Form
        form={form}
        onFinish={onFormFinish}
        initialValues={{
          name: "",
          email: "",
        }}
      >
        <Form.Item
          className="mb-2"
          name="name"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input placeholder="이름 입력" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "이메일을 입력해주세요." }]}
        >
          <Input placeholder="이메일 입력" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className="mt-8">
            아이디 찾기
          </Button>
        </Form.Item>
      </Form>
      {userId && <p>User ID: {userId}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </LoginForm>
  );
};

export default FindUserId;
