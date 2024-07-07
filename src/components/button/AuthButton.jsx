import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useSelector } from "react-redux";

/**
 * 권한에 따라 보이는 버튼
 */
const AuthButton = React.memo(({ text, clickHandler, adminRoleList, colorType = "primary", size = "default" }) => {
  const loginUserRole = useSelector(
    state => state?.auth?.user?.roleList?.[0],
    (prevRole, nextRole) => prevRole === nextRole,
  );

  if (adminRoleList?.includes(loginUserRole)) {
    return (
      <Button type={colorType} size={size} onClick={clickHandler}>
        {text}
      </Button>
    );
  } else {
    return null;
  }
});

AuthButton.displayName = "AuthButton";

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  adminRoleList: PropTypes.arrayOf(String).isRequired,
  colorType: PropTypes.string,
  size: PropTypes.oneOf(["small", "default", "large"]),
};
export default AuthButton;
