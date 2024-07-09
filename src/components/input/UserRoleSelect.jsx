import PropTypes from "prop-types";
import { Select } from "antd";
import { getRoles } from "apis/commonAPI";
import { useEffect, useState } from "react";

const UserRoleSelect = ({ userTypeList = "ADMIN" }) => {
  const [roleOptions, setRoleOptions] = useState([]);
  const defaultValue = userTypeList === "ADMIN" ? "NORMAL_ADMIN" : "";

  useEffect(() => {
    getRoleOptions();
  }, []);

  /**
   * 사용자 유형에 따른 권한 리스트 조회
   */
  const getRoleOptions = async () => {
    const response = await getRoles({ userTypeList });
    try {
      if (response.status === 200 && response.data.status === "success") {
        setRoleOptions(response?.data?.data?.payload);
      }
    } catch (error) {
      console.error("Error fetching getRoleOptions:", error);
    }
  };

  return (
    <Select defaultValue={defaultValue}>
      {roleOptions.length > 0 ? (
        roleOptions.map(option => (
          <Select.Option className='h-[30px]' key={option.role} value={option.role}>
            {option.text}
          </Select.Option>
        ))
      ) : (
        <Select.Option className='h-[30px]' disabled value=''>
          로딩 중...
        </Select.Option>
      )}
    </Select>
  );
};

UserRoleSelect.propTypes = {
  // userTypeList: PropTypes.arrayOf(String),
  userTypeList: PropTypes.string,
};

export default UserRoleSelect;
