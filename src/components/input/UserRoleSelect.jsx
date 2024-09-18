import PropTypes from "prop-types";
import { getRoleList } from "utils/userTypes";
import { Select } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";

/**
 * 유저 권한 Select input 컴포넌트
 */
const UserRoleSelect = ({ value, onChange, userType = "ADMIN" }) => {
  const roleOptions = getRoleList(userType);

  useEffect(() => {
    console.log("value:", value);
  }, [value]);

  return (
    <Select value={value} onChange={onChange}>
      {isEmpty(roleOptions) ? (
        <Select.Option className='h-[30px]' value=''>
          선택지 없음
        </Select.Option>
      ) : (
        roleOptions.map(option => (
          <Select.Option className='h-[30px]' key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))
      )}
    </Select>
  );
};

UserRoleSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  userType: PropTypes.string,
};

export default UserRoleSelect;
