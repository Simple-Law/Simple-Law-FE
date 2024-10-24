import { Link, useNavigate, useParams } from "react-router-dom";
import { Input, Button, Form } from "antd";
import { useDispatch } from "react-redux";
import LoginForm from "components/layout/AuthFormLayout";
import SvgEye from "components/Icons/Eye";
import SvgEyeclose from "components/Icons/Eyeclose";
import SvgKakao from "components/Icons/Kakao";
import SvgNaver from "components/Icons/Naver";
import SvgGoogle from "components/Icons/Google";
import { loginUserAction } from "../../redux/actions/authActions";
import { useMessageApi } from "components/messaging/MessageProvider";

const Login = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageApi = useMessageApi();

  let { typeName, toggleType, toggleText } = "";
  switch (type) {
    case "admin":
      typeName = "관리자";
      break;
    case "lawyer":
      typeName = "변호사";
      toggleType = "quest";
      toggleText = "의뢰인이신가요?";
      break;
    default:
      typeName = "의뢰인";
      toggleType = "lawyer";
      toggleText = "변호사이신가요?";
      break;
  }
  const title = `${typeName} 로그인`;

  const handleLogin = async values => {
    try {
      const { success, message } = await dispatch(loginUserAction(values, type));
      const successUrl = type === "admin" ? "/admin/manage-admin" : "/board?status=All_request";

      if (success) {
        messageApi.success("로그인 성공!");
        navigate(successUrl); // 로그인 성공 시 이동
      } else {
        messageApi.error(message || "로그인 실패!");
        if (message === "pending-approval") {
          messageApi.warning("가입 승인 중입니다.");
        }
      }
    } catch (error) {
      messageApi.error("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <LoginForm title={title}>
      <Form onFinish={handleLogin}>
        <div className='gap-10 flex justify-center flex-col'>
          <div>
            <Form.Item name='id' rules={[{ required: true, message: "아이디를 입력하세요!" }]}>
              <Input placeholder='아이디 입력' className=' px-4 py-3' />
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
                  아이디 찾기
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
              <div className='w-full flex gap-6 justify-center'>
                <div className='flex justify-center items-center rounded-[50px] bg-kakaoYellow w-[54px] h-[54px]'>
                  <SvgKakao width='24px' height='24px' />
                </div>
                <div className='flex justify-center items-center rounded-[50px] bg-naverGreen w-[54px] h-[54px]'>
                  <SvgNaver width='20px' height='20px' />
                </div>
                <div className='flex justify-center items-center rounded-[50px] border-[1px] w-[54px] h-[54px]'>
                  <SvgGoogle width='24px' height='24px' fill='#FFF' />
                </div>
              </div>
              <Link to={`/login/${toggleType}`} className='text-base font-normal text-center text-Base-Blue underline'>
                {toggleText}
              </Link>
            </>
          )}
        </div>
      </Form>
    </LoginForm>
  );
};

export default Login;
