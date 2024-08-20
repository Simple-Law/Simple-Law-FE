import { useSelector } from "react-redux";
import { Button, Switch } from "antd";
const MyPage = () => {
  const user = useSelector(state => state.auth.user);
  console.log(user);
  console.log(user.type);
  const onChange = checked => {
    console.log(`switch to ${checked}`);
  };
  const formatPhoneNumber = phoneNumber => {
    return phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };
  const formattedPhone = formatPhoneNumber(user.phone);
  return (
    <div>
      <h2>계정 관리</h2>
      <p>가입 정보</p>
      <div>
        {/*TODO: DY - 프로필 이미지 수정하기 (가입 정보 수정 api 필요) */}
        <div>프로필</div>
      </div>
      <div>이름 {user.name}</div>
      <div>아이디 {user.id}</div>
      {user.type !== "MEMBER" && (
        <div>
          <div>소속 {user.name}</div>
          <div>담당 의뢰분야 {user.name}</div>
        </div>
      )}
      <p>계정</p>
      <div>이메일 {user.email}</div>
      {/*TODO: DY -  비밀번호 변경?*/}
      <div>비밀번호 </div>
      <p>SNS로 간편 가입한 경우 비밀번호 없이 로그인이 가능합니다.</p>
      <div>휴대폰 번호 {formattedPhone}</div>
      <p>알림 설정</p>
      <div>
        {/*TODO: DY -  마케팅 정보 수정*/}
        마케팅 수신 설정 <Switch checked={user.isMarketingConsent} onChange={onChange} />
      </div>
      {user.type !== "MEMBER" && <div>의뢰 안내 설정</div>}
      {/* TODO: DY - 탈퇴 기능 추가 */}
      <Button>회원탈퇴</Button>
    </div>
  );
};

export default MyPage;
