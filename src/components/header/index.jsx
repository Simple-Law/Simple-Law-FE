import React, { useState } from "react";
import SvgLogo from "components/Icons/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import SvgProfile from "components/Icons/Profile";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "actions/authActions";
import { useMessageApi } from "components/MessageProvider";
const Header = () => {
  const dispatch = useDispatch();
  const useMessage = useMessageApi();
  const user = useSelector(state => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    dispatch(logout());
    setIsModalVisible(false);
    useMessage.success("로그아웃 되었습니다.");
    navigate("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000]'>
      <div className='flex justify-between items-center h-16 w-full'>
        <div className='pl-[47px]'>
          <Link to='/'>
            <SvgLogo width='115px' height='auto' className='mx-auto' />
          </Link>
        </div>
        <div className='flex items-center pr-[32px] gap-[10px]'>
          {user ? <p>{user.name}</p> : <Link to='/login'>로그인</Link>} {/* 로그인한 사용자의 이름 표시 */}
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
