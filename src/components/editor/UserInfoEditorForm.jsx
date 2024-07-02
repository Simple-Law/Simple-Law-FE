import PropTypes from "prop-types";
import { Button, Form, Input, Space } from "antd";
import { SelectAdminTag } from "components/tags/UserTag";
import { validateEmailType, validateRequired, validatePassword } from "utils/validateUtil";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import styled from "styled-components";

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

  const onCancle = () => {
    formData.resetFields();
    closeModal();
  };

  return (
    <Form
      className=''
      layout='vertical'
      form={formData}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onSubmit}
    >
      <StyledFormItem label='아이디' name='id' rules={[validateRequired("아이디를")]}>
        <Input disabled={!isEmpty(userData)} />
      </StyledFormItem>
      <StyledFormItem label='이름' name='name' rules={[validateRequired("이름을")]}>
        <Input />
      </StyledFormItem>

      <StyledFormItem label='이메일' name='email' rules={[validateEmailType, validateRequired("이메일을")]}>
        <Input />
      </StyledFormItem>

      <StyledFormItem
        label='비밀번호'
        name='password'
        rules={[
          validateRequired("비밀번호를"),
          () => ({
            validatePassword,
          }),
        ]}
      >
        <Input.Password />
      </StyledFormItem>

      {isAdmin ? (
        <StyledFormItem label='권한' name='userType' rules={[validateRequired("권한을")]}>
          <SelectAdminTag
            defaultValue={userData?.userType}
            value={formData.getFieldValue("userType")}
            onChange={value => formData.setFieldsValue({ userType: value })}
          />
        </StyledFormItem>
      ) : null}

      <Form.Item>
        <Button className='w-1/2' onClick={onCancle}>
          취소
        </Button>
        <Button className='w-1/2' type='primary' htmlType='submit'>
          {userData ? "수정" : "등록"}하기
        </Button>
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

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 20px;
`;
export default UserInfoEditorForm;
