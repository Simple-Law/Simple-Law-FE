import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import { validateEmailType, validateRequired, validatePassword } from "utils/validateUtil";
import { isEmpty } from "lodash";
import styled from "styled-components";
import UserRoleSelect from "components/input/UserRoleSelect";
import { useEffect } from "react";

const UserInfoEditorForm = ({ onSubmit, closeModal, userData = {}, isAdmin = false }) => {
  const [formData] = Form.useForm();
  let initialValues = {};

  useEffect(() => {
    resetFormData();
  }, [userData]);

  /**
   * formData 초기화
   */
  const resetFormData = () => {
    console.log(">>>>>", userData);
    initialValues = {
      id: isEmpty(userData) ? "" : userData.id,
      name: isEmpty(userData) ? "" : userData.name,
      email: isEmpty(userData) ? "" : userData.email,
      password: "",
      role: isEmpty(userData) ? ["SUPER_ADMIN"] : userData.roleList?.[0],
    };
    if (isAdmin) initialValues.role = isEmpty(userData) ? "SUPER_ADMIN" : userData?.roleList?.[0];

    formData.resetFields();
    formData.setFieldsValue(initialValues);
  };

  /**
   * 취소 버튼 클릭
   */
  const clickCancle = () => {
    resetFormData();
    closeModal();
  };

  return (
    <StyledForm className='' layout='vertical' form={formData} initialValues={initialValues} onFinish={onSubmit}>
      <StyledFormItem label='아이디' name='id' rules={[validateRequired("아이디를")]}>
        <Input className='h-[35px]' disabled={!isEmpty(userData)} autoComplete='off' />
      </StyledFormItem>
      <StyledFormItem label='이름' name='name' rules={[validateRequired("이름을")]}>
        <Input className='h-[35px]' />
      </StyledFormItem>

      <StyledFormItem label='이메일' name='email' rules={[validateEmailType, validateRequired("이메일을")]}>
        <Input className='h-[35px]' autoComplete='off' />
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
        <Input.Password className='h-[35px]' autoComplete='new-password' />
      </StyledFormItem>

      {isAdmin ? (
        <StyledFormItem label='권한' name='role'>
          <UserRoleSelect
            className='h-[35px]'
            value={formData.getFieldValue("role")}
            onChange={value => formData.setFieldsValue({ role: value })}
          />
        </StyledFormItem>
      ) : null}

      <Form.Item>
        <div className='flex gap-[10px] justify-center my-[20px]'>
          <Button className='w-1/2 h-[48px]' onClick={clickCancle}>
            취소
          </Button>
          <Button className='w-1/2 h-[48px]' type='primary' htmlType='submit'>
            {userData ? "수정" : "등록"}하기
          </Button>
        </div>
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
