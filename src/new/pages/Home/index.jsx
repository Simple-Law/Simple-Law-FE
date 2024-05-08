import { Button } from "antd";
import LoginForm from "components/LoginForm";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (value) => {
    if (value === "quest") {
      navigate("/login/quest");
    } else if (value === "lawyer") {
      navigate("/login/lawyer");
    }
  };

  return (
    <>
      <LoginForm title="로그인을 하려면 가입해!">
        <Button
          block
          value="quest"
          onClick={(e) => handleLogin(e.target.value)}
        >
          의뢰인
        </Button>
        <Button
          type="primary"
          block
          value="lawyer"
          onClick={(e) => handleLogin(e.target.value)}
          className="mt-1"
        >
          변호사
        </Button>
      </LoginForm>
    </>
  );
};

export default Home;
