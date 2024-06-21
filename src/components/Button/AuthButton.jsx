import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const AuthButton = ({ text, clickHandler, authRoles, colorClass }) => {
  const loginUserROle = useSelector(state => state.auth.userRole);
  if (authRoles.includes(loginUserROle)) {
    return (
      <button onClick={clickHandler} className={`btn btn-${colorClass}`}>
        {text}
      </button>
    );
  } else {
    return null;
  }
};
AuthButton.propTypes = {
  text: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  authRoles: PropTypes.arrayOf(String).isRequired,
  colorClass: PropTypes.string,
};
AuthButton.defaultProps = {
  text: "추가",
  colorClass: "primary",
};

export default AuthButton;
