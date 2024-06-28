import PropTypes from "prop-types";
import { Button, Form, Input, Space } from "antd";
import { SelectAdminTag } from "components/tags/UserTag";
import { validateEmailType, validateRequired, validatePassword } from "utils/validateUtil";
import { isEmpty } from "lodash";
import { useEffect } from "react";

const UserInfoEditorForm = ({ onSubmit, closeModal, userData = null, isAdmin = false }) => {
  const [formData] = Form.useForm();

  useEffect(() => {
    formData.setFieldsValue({
      id: userData?.id,
      name: userData?.name,
      email: userData?.email,
      password: "",
      userType: isAdmin ? userData?.userType : "",
    });
  }, [userData]);

  return (
    <Form
      layout='vertical'
      form={formData}
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
      onFinish={onSubmit}
    >
      <Form.Item label='아이디' name='id' rules={[validateRequired("아이디")]}>
        <Input disabled={!isEmpty(userData)} />
      </Form.Item>
      <Form.Item label='이름' name='name' rules={[validateRequired("이름")]}>
        <Input />
      </Form.Item>

      <Form.Item label='이메일' name='email' rules={[validateEmailType, validateRequired("이메일")]}>
        <Input />
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
        <Form.Item label='권한' name='userType' rules={[validateRequired("권한")]}>
          <SelectAdminTag defaultValue={userData?.userType} />
        </Form.Item>
      ) : null}

      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit'>
            {userData ? "수정" : "등록"}
          </Button>
          <Button type='primary' onClick={closeModal}>
            닫기
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
UserInfoEditorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  userData: PropTypes.object,
  isAdmin: PropTypes.bool,
};
export default UserInfoEditorForm;
