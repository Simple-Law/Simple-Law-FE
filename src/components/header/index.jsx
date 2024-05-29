// import React from "react";
// import Logo from "assets/images/icons/Logo.svg";
// import { Link } from "react-router-dom";
// import SvgProfile from "components/Icons/Profile";

// const Header = () => {
//   return (
//     <div className="h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000]">
//       <div className="flex justify-between items-center h-16 w-full">
//         <div className="pl-[47px]">
//           <Link to="/">
//             <img src={Logo} alt="" className="mx-auto w-[115px]" />
//           </Link>
//         </div>
//         <div className="flex items-center pr-[32px] gap-[10px]">
//           <p>닉네임</p>
//           <div>
//             <SvgProfile />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
import React, { useState } from "react";
import Logo from "assets/images/icons/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import SvgProfile from "components/Icons/Profile";
import { useAuth } from "contexts/AuthContext"; // AuthContext 사용

const Header = () => {
  const { user, logout } = useAuth(); // 로그인한 사용자 정보 및 로그아웃 함수 가져오기
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    logout(); // 로그아웃 함수 호출
    message.success("로그아웃 되었습니다.");
    setIsModalVisible(false);
    navigate("/login"); // 로그인 페이지로 이동
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000]">
      <div className="flex justify-between items-center h-16 w-full">
        <div className="pl-[47px]">
          <Link to="/">
            <img src={Logo} alt="" className="mx-auto w-[115px]" />
          </Link>
        </div>
        <div className="flex items-center pr-[32px] gap-[10px]">
          {user ? <p>{user.name}</p> : <Link to="/login">로그인</Link>} {/* 로그인한 사용자의 이름 표시 */}
          <div onClick={showLogoutModal}>
            <SvgProfile />
          </div>
        </div>
      </div>
      <Modal
        title="로그아웃"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="예"
        cancelText="아니오"
      >
        <p>정말 로그아웃 하시겠습니까?</p>
      </Modal>
    </div>
  );
};

export default Header;
