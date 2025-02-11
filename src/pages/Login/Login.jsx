import { Link, useNavigate, useParams } from "react-router-dom";
import { Input, Button, Form, Modal } from "antd";
import { useDispatch } from "react-redux";
import LoginForm from "components/layout/AuthFormLayout";
import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";
import SvgKakao from "components/Icons/Kakao";
import { loginUserAction } from "../../redux/actions/authActions";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useState } from "react";
import useKakao from "hooks/useKakao";

const Login = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageApi = useMessageApi();

  useKakao();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [shouldNavigateToMyPage, setShouldNavigateToMyPage] = useState(false);

  let { typeName, toggleType, toggleText } = "";

  switch (type) {
    case "admin":
      typeName = "관리자";
      break;
    case "lawyers":
      typeName = "변호사";
      toggleType = "clients";
      toggleText = "의뢰인이신가요?";
      break;
    default:
      typeName = "의뢰인";
      toggleType = "lawyers";
      toggleText = "변호사이신가요?";
      break;
  }
  const title = `${typeName} 로그인`;

  const handleLogin = async values => {
    try {
      const { success, message } = await dispatch(loginUserAction(values));
      const successUrl = type === "admin" ? "/admin/manage-admin" : "/request?status=All_request";
      if (success) {
        messageApi.success("로그인 성공!");
        if (shouldNavigateToMyPage) {
          navigate("/my-page");
        } else {
          navigate(successUrl); // 로그인 성공 시 기본 이동
        }
      } else {
        if (message === "Not Yet Verification") {
          messageApi.error("변호사 승인 대기중입니다.");
        } else if (message === "rejected") {
          const userInfo = "거절사유";
          // TODO: 로그인 실패 시 거절 사유 가져오기
          // const userInfo = await getMemberInfo(type);
          // setRejectionReason(userInfo.rejectionReason);
          setRejectionReason(userInfo);
          setIsModalVisible(true); // 모달 표시
          setShouldNavigateToMyPage(true); // 마이페이지로 이동 설정
        } else {
          messageApi.error(message || "로그인 실패!");
        }
      }
    } catch (error) {
      messageApi.error("로그인 중 오류가 발생했습니다.", error);
    }
  };
  // 카카오 로그인
  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.login({
        success: authObj => {
          console.log("Kakao login success:", authObj);

          // 사용자 정보 요청
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: res => {
              console.log("Kakao user info:", res);

              // 예: 사용자 정보를 서버로 전송
              const userData = {
                id: res.id,
                email: res.kakao_account.email,
                nickname: res.properties.nickname,
              };

              console.log("User data:", userData);

              // TODO: Redux 또는 서버로 전송하여 처리
              // dispatch(loginWithKakao(userData));
              messageApi.success("카카오 로그인 성공!");
              navigate("/my-page"); // 로그인 성공 시 이동할 경로
            },
            fail: error => {
              console.error("Kakao user info request failed:", error);
              messageApi.error("사용자 정보를 가져오는 데 실패했습니다.");
            },
          });
        },
        fail: err => {
          console.error("Kakao login failed:", err);
          messageApi.error("카카오 로그인 실패!");
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigate("/my-page");
  };
  return (
    <LoginForm title={title}>
      <Form onFinish={handleLogin}>
        <div className='gap-10 flex justify-center flex-col'>
          <div>
            {/* 로그인 실패 메시지 회원가입이 안된 이메일입니다 */}
            <Form.Item name='email' rules={[{ required: true, message: "이메일을 입력하세요!" }]}>
              <Input placeholder='이메일 입력' className=' px-4 py-3' />
            </Form.Item>
            <Form.Item name='password' rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}>
              <Input.Password
                className=' px-4 py-3 my-2'
                placeholder='비밀번호 입력'
                iconRender={visible => (visible ? <SvgEye /> : <SvgEyeclose />)}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' block className=' px-4 py-3 h-12 text-base font-medium' htmlType='submit'>
                로그인
              </Button>
            </Form.Item>
          </div>
          {type !== "admin" && (
            <>
              <div className='justify-center items-center gap-3 inline-flex w-full'>
                <Link
                  to={`/sign-up/${type}`}
                  className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
                >
                  회원가입
                </Link>
                <div className='w-px h-3 bg-zinc-300'></div>
                <Link
                  to={`/find-id/${type}`}
                  className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
                >
                  이메일 찾기
                </Link>
                <div className='w-px h-3 bg-zinc-300'></div>
                <Link
                  to={`/find-pw/${type}`}
                  className="text-stone-500 text-base font-normal font-['Pretendard'] leading-tight"
                >
                  <span>비밀번호 찾기</span>
                </Link>
              </div>
              <div className='justify-start items-center inline-flex'>
                <div className='grow shrink basis-0 h-px bg-zinc-200'></div>
                <div className='px-3 justify-center items-center gap-2.5 flex'>
                  <div className="text-center text-neutral-400 text-base font-medium font-['Pretendard'] leading-tight">
                    또는
                  </div>
                </div>
                <div className='grow shrink basis-0 h-px bg-zinc-200'></div>
              </div>
              <div className='w-full'>
                <div
                  className='flex justify-center items-center bg-kakaoYellow w-full h-[54px] gap-2'
                  onClick={handleKakaoLogin}
                >
                  <SvgKakao width='24px' height='24px' />
                  <span>카카오 로그인</span>
                </div>
              </div>
              <Link to={`/login/${toggleType}`} className='text-base font-normal text-center text-Base-Blue underline'>
                {toggleText}
              </Link>
            </>
          )}
        </div>
      </Form>
      {/* 거절 사유 모달 */}
      <Modal
        title='가입 거절 안내'
        visible={isModalVisible}
        onOk={handleModalClose}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{rejectionReason}</p>
      </Modal>
    </LoginForm>
  );
};

export default Login;
