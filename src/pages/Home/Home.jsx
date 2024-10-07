import { Button } from "antd";
import LoginForm from "components/layout/AuthFormLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const userType = useSelector(state => state.auth.user)?.type || "guest";

  if (userType === "ADMIN") {
    return (
      <>
        <LoginForm>
          <Button block onClick={() => navigate("/login/admin")}>
            로그인
          </Button>
          <Button block className='mt-1' onClick={() => navigate("admin/join-request")}>
            전체 의뢰함: 컨텍 예정
          </Button>
          <Button block className='mt-1' onClick={() => navigate("/admin/manage-admin")}>
            관리자 계정 관리
          </Button>
          <Button block className='mt-1' onClick={() => navigate("/admin/manage-user")}>
            회원 관리: 전체 사용자
          </Button>
          <Button block className='mt-1' onClick={() => navigate("admin/join-request")}>
            회원 관리: 회원가입 요청
          </Button>
        </LoginForm>
      </>
    );
  } else {
    return (
      <>
        <LoginForm>
          <Button block onClick={() => navigate("/login/admin")}>
            관리자 로그인
          </Button>
          <Button block onClick={() => navigate("/login/quest")}>
            로그인
          </Button>
          <Button block className='mt-1' onClick={() => navigate("/board")}>
            의뢰자메일
          </Button>
          <Button block className='mt-1' onClick={() => navigate("/mail/quest")}>
            글작성
          </Button>
        </LoginForm>
      </>
    );
  }
};

export default Home;
