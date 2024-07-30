import { loginUser as apiLoginUser, sendAuthCode as apiSendAuthCode } from "apis/usersApi";
import { LOGIN, LOGOUT, REFRESH_ACCESS_TOKEN } from "../types";
import { showUserLoading, hideUserLoading } from "../../redux/actions/loadingAction";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const login = (tokens, user) => {
  // 쿠키에 토큰 저장
  cookies.set("accessToken", tokens.accessToken, { path: "/" });
  cookies.set("refreshToken", tokens.refreshToken, { path: "/" });
  return {
    type: LOGIN,
    payload: { tokens, user },
  };
};

export const logout = () => {
  // 쿠키에서 토큰 제거
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
  return {
    type: LOGOUT,
  };
};

export const refreshAccessToken = newAccessToken => {
  // 쿠키에 새로운 액세스 토큰 저장
  cookies.set("accessToken", newAccessToken, { path: "/" });
  return {
    type: REFRESH_ACCESS_TOKEN,
    payload: newAccessToken,
  };
};

// 비동기 Thunk 함수
export const loginUserAction = (values, userType) => async dispatch => {
  dispatch(showUserLoading());
  try {
    const response = await apiLoginUser(values, userType);
    const { token: tokens, user } = response.data.payload;

    // 쿠키에 토큰 저장
    cookies.set("accessToken", tokens.accessToken, { path: "/" });
    cookies.set("refreshToken", tokens.refreshToken, { path: "/" });

    dispatch(login(tokens, user));
    dispatch(hideUserLoading());

    return { success: true };
  } catch (error) {
    dispatch(hideUserLoading());
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
