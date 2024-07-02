import PropTypes from "prop-types";
import { Button } from "antd";
import { useSelector } from "react-redux";

const AuthButton = ({ text, clickHandler, adminRoleList, colorType = "primary", size = "default" }) => {
  const loginUserRole = useSelector(state => state?.auth?.user?.adminRoleList?.[0]);

  if (adminRoleList.includes(loginUserRole)) {
    return (
      <Button type={colorType} size={size} onClick={clickHandler}>
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
  adminRoleList: PropTypes.arrayOf(String).isRequired,
  colorType: PropTypes.string,
  size: PropTypes.oneOf(["small", "default", "large"]),
};
export default AuthButton;
