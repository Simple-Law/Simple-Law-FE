import { Button } from "antd";
import LoginForm from "components/LoginForm";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <LoginForm title="로그인을 하려면 가입해!">
        <Button block onClick={() => navigate("/login/quest")}>
          의뢰인
        </Button>
        <Button type="primary" block onClick={() => navigate("/login/lawyer")} className="mt-1">
          변호사
        </Button>
        <Button block className="mt-1" onClick={() => navigate("/board")}>
          의뢰자메일
        </Button>
        <Button block className="mt-1" onClick={() => navigate("/mail/quest")}>
          글작성
        </Button>
        <Button block className="mt-1" onClick={() => navigate("/admin/board")}>
          어드민
        </Button>
      </LoginForm>
    </>
  );
};

export default Home;
