import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import { validateEmailType, validateRequired, validatePassword } from "utils/validateUtil";
import { isEmpty } from "lodash";
import styled from "styled-components";
import UserRoleSelect from "components/input/UserRoleSelect";

const UserInfoEditorForm = ({ onSubmit, closeModal, userData = null, isAdmin = false }) => {
  const [formData] = Form.useForm();

  const onCancle = () => {
    formData.resetFields();
    closeModal();
  };

  return (
    <StyledForm
      className=''
      layout='vertical'
      form={formData}
      initialValues={{
        remember: true,
        id: userData?.id,
        name: userData?.name,
        email: userData?.email,
        password: "",
        userType: isAdmin ? userData?.userType : "NORMAL_ADMIN",
      }}
      onFinish={onSubmit}
    >
      <StyledFormItem label='아이디' name='id' rules={[validateRequired("아이디를")]}>
        <Input className='h-[35px]' disabled={!isEmpty(userData)} />
      </StyledFormItem>
      <StyledFormItem label='이름' name='name' rules={[validateRequired("이름을")]}>
        <Input className='h-[35px]' />
      </StyledFormItem>

      <StyledFormItem label='이메일' name='email' rules={[validateEmailType, validateRequired("이메일을")]}>
        <Input className='h-[35px]' />
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
        <Input.Password className='h-[35px]' />
      </StyledFormItem>

      {isAdmin ? (
        <StyledFormItem label='권한' name='userType'>
          <UserRoleSelect className='h-[35px]' />
        </StyledFormItem>
      ) : null}

      <Form.Item className='pt-[20px] pb-[5px]'>
        <Button className='w-[196px] h-[48px] mr-[8px]' onClick={onCancle}>
          취소
        </Button>
        <Button className='w-[196px] h-[48px]' type='primary' htmlType='submit'>
          {userData ? "수정" : "등록"}하기
        </Button>
      </Form.Item>
    </StyledForm>
  );
};
UserInfoEditorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  userData: PropTypes.object,
  isAdmin: PropTypes.bool,
};

const StyledForm = styled(Form)`
  width: 400px;
  padding-top: 20px;
`;

const StyledFormItem = styled(Form.Item)`
  height: 76px;
  margin-bottom: 15px;
`;

export default UserInfoEditorForm;
