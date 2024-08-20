import { useEffect, useRef, useState } from "react";
import SvgLogo from "components/Icons/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import SvgProfile from "components/Icons/Profile";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { useMessageApi } from "components/messaging/MessageProvider";
import UserTag from "components/tags/UserTag";
const Header = () => {
  const dispatch = useDispatch();
  const useMessage = useMessageApi();

  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.type === "ADMIN";
  const loginUrl = isAdmin ? "/admin/login" : "/login";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  const showLogoutModal = () => {
    if (user) setIsModalVisible(true);
    setIsDropdownVisible(false);
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(prev => !prev);
  };
  const handleOk = () => {
    dispatch(logout());
    setIsModalVisible(false);
    useMessage.success("로그아웃 되었습니다.");
    navigate(loginUrl);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleAccountManagement = () => {
    navigate("/my-page");
  };

  const handlePaymentManagement = () => {
    navigate("/my-page");
  };
  return (
    <div className='h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000] '>
      <div className='flex justify-between items-center h-16 w-full'>
        <Link to='/'>
          <div className='flex pl-[47px]'>
            <SvgLogo width='118px' height='30px' className='mx-auto' />
            {isAdmin ? <UserTag userType={"ADMIN"} className='mt-[5px] ml-[7px]' /> : null}
          </div>
        </Link>
        <div className='flex items-center pr-[32px] gap-[10px] cursor-pointer'>
          {user ? <p className='text-sm font-medium'>{user.name}</p> : <Link to={loginUrl}>로그인</Link>}
          {/* 로그인한 사용자의 이름 표시 */}
          <div onClick={toggleDropdown}>
            <SvgProfile />
          </div>
          {isDropdownVisible && (
            <div
              ref={dropdownRef}
              className='absolute right-0 mt-2 w-[200px] h-[150px] bg-white border shadow-lg rounded'
              style={{ top: "100%" }}
            >
              <div className='flex items-center gap-2'>
                <SvgProfile />
                <p className='text-sm font-medium'>{user.name}</p>
              </div>
              <div className='p-2 cursor-pointer hover:bg-gray-100' onClick={handleAccountManagement}>
                계정 관리
              </div>
              <div className='p-2 cursor-pointer hover:bg-gray-100' onClick={handlePaymentManagement}>
                결제 관리
              </div>
              <div className='p-2 cursor-pointer hover:bg-gray-100' onClick={showLogoutModal}>
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title='로그아웃'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='예'
        cancelText='아니오'
      >
        <p>정말 로그아웃 하시겠습니까?</p>
      </Modal>
    </div>
  );
};

export default Header;
