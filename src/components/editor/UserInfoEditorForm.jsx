import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import { SelectAdminTag } from "components/tags/UserTag";
import { validateEmailType, validateRequired, validatePassword } from "utils/validateUtil";
import { isEmpty } from "lodash";

const UserInfoEditorForm = (handleSubmit, userData = null, isAdmin = false) => {
  const buttonText = userData ? "수정" : "등록";

  const onFinish = values => {
    console.log("Success:", values);
    handleSubmit();
  };

  return (
    <Form
      name='basic'
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item label='아이디' name='userId'>
        <Input disabled={!isEmpty(userData)} />
      </Form.Item>
      <Form.Item label='이름' name='name' rules={[validateRequired("이름")]}>
        <Input placeholder='이름' />
      </Form.Item>

      <Form.Item label='이메일' name='email' rules={[validateEmailType, validateRequired]}>
        <Input placeholder='이메일' />
      </Form.Item>

      <Form.Item
        label='비밀번호'
        name='password'
        rules={[
          validateRequired("비밀번호"),
          () => ({
            validatePassword,
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      {isAdmin ? (
        <Form.Item>
          <SelectAdminTag defaultValue={userData?.adminType} />
        </Form.Item>
      ) : null}

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type='primary'>{buttonText}</Button>
      </Form.Item>
    </Form>
  );
};
UserInfoEditorForm.prototype = {
  handleSubmit: PropTypes.func.isRequired,
  userData: PropTypes.object,
};
export default UserInfoEditorForm;
