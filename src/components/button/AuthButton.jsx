import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useSelector } from "react-redux";

const AuthButton = ({ text, clickHandler, authRoles, colorType = "primary" }) => {
  //TODO: kmee - 관리자/me API roleList 추가 완료 후 로그인 정보 가져오기
  // const loginUserROle = useSelector(state => state.auth.userRole);
  const loginUserROle = "SUPER_ADMIN";
  if (authRoles.includes(loginUserROle)) {
    return (
      <Button type={`${colorType}`} onClick={clickHandler}>
        {text}
      </Button>
    );
  } else {
    return null;
  }
};
AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  authRoles: PropTypes.arrayOf(String).isRequired,
  colorType: PropTypes.string,
};
export default AuthButton;
