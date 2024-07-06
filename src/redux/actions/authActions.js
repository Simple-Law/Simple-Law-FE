import { loginUser as apiLoginUser, sendAuthCode as apiSendAuthCode } from "apis/usersApi";
import { LOGIN, LOGOUT } from "../types";
import { showUserLoading, hideUserLoading } from "../../redux/actions/loadingAction";

export const login = (tokens, user) => ({
  type: LOGIN,
  payload: { tokens, user },
});

export const logout = () => ({
  type: LOGOUT,
});

// 비동기 Thunk 함수
export const loginUserAction = (values, userType) => async dispatch => {
  dispatch(showUserLoading()); // 로그인 요청 전 로딩 표시
  try {
    const response = await apiLoginUser(values, userType);
    const { token: tokens, user } = response.data.payload;

    dispatch(login(tokens, user));
    dispatch(hideUserLoading()); // 로그인 성공 후 로딩 숨김

    return { success: true }; // 성공 시 객체 반환
  } catch (error) {
    dispatch(hideUserLoading()); // 로그인 실패 후 로딩 숨김
    const message = error.response?.data?.message || "로그인 실패!";
    console.error("Error during login process:", error.response?.data || error);
    return { success: false, message: message };
  }
};

// 인증번호 발송 Thunk 함수
export const sendAuthCodeAction = (phoneNumber, type) => async dispatch => {
  dispatch(showUserLoading());
  try {
    await apiSendAuthCode(phoneNumber, type);
    dispatch(hideUserLoading());
    return { success: true };
  } catch (error) {
    dispatch(hideUserLoading());
    const message = error.response?.data?.message || "인증번호 발송 실패!";
    console.error("Error during sending auth code:", error.response?.data || error);
    return { success: false, message: message };
  }
};
