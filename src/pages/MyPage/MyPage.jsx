import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
const MyPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  console.log(user);

  return (
    <>
      <h2>계정 관리</h2>
      {/* <p>가입 정보</p>
      <div>프로필</div>
      <div>이름 {user.name}</div>
      <div>아이디 {user.name}</div>
      <div>소속 {user.name}</div>
      <div>담당 의뢰분야 {user.name}</div>
      <p>계정</p>
      <div>이메일 {user.name}</div>
      <div>비밀번호 {user.name}</div>
      <p>SNS로 간편 가입한 경우 비밀번호 없이 로그인이 가능합니다.</p>
      <div>휴대폰 번호 {user.name}</div>
      <p>알림 설정</p>
      <div>마케팅 수신 설정</div>
      <div>의뢰 안내 설정</div>
      <Button>회원탈퇴</Button> */}
    </>
  );
};

export default MyPage;
