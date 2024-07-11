import PropTypes from "prop-types";
import { Select } from "antd";
import { getRoles } from "apis/commonAPI";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import { useMessageApi } from "components/messaging/MessageProvider";
/**
 * 유저 권한 Select input 컴포넌트
 */
const UserRoleSelect = ({ value, userTypeList = "ADMIN" }) => {
  const messageApi = useMessageApi();
  const loading = useSelector(state => state.loading.SkeletonLoading);
  const dispatch = useDispatch();

  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    getRoleOptions();
  }, []);

  /**
   * 사용자 유형에 따른 권한 API 호출
   */
  const getRoleOptions = async () => {
    dispatch(showSkeletonLoading);
    const response = await getRoles({ userTypeList });
    try {
      if (response.status === 200 && response.data.status === "success") {
        setRoleOptions(response?.data?.data?.payload);
      }
    } catch (error) {
      messageApi.error(response.message);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  return loading ? (
    <SkeletonLoading type='short' />
  ) : (
    <Select defaultValue={value} value={value}>
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
  value: PropTypes.string,
  userTypeList: PropTypes.string,
};

export default UserRoleSelect;
