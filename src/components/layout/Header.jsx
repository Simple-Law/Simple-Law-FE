import { useState } from "react";
import SvgLogo from "components/Icons/Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const showLogoutModal = () => {
    if (user) setIsModalVisible(true);
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

  return (
    <div className='h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000]'>
      <div className='flex justify-between items-center h-16 w-full'>
        <Link to='/'>
          <div className='flex pl-[47px]'>
            <SvgLogo width='118px' height='30px' className='mx-auto' />
            {isAdmin ? <UserTag userType={"ADMIN"} className='mt-[5px] ml-[7px]' /> : null}
          </div>
        </Link>
        <div className='flex items-center pr-[32px] gap-[10px]'>
          {user ? <p className='text-sm font-medium'>{user.name}</p> : <Link to={loginUrl}>로그인</Link>}{" "}
          {/* 로그인한 사용자의 이름 표시 */}
          <div onClick={showLogoutModal}>
            <SvgProfile />
          </div>
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
