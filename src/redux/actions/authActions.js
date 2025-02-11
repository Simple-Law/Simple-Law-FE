import { loginUser as apiLoginUser, sendAuthCode as apiSendAuthCode, getMemberInfo } from "apis/usersApi";
import { LOGIN, LOGOUT, REFRESH_ACCESS_TOKEN } from "../types";
import { showUserLoading, hideUserLoading } from "../../redux/actions/loadingAction";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const login = (tokens, user) => {
  // 쿠키에 토큰 저장
  cookies.set("accessToken", tokens.accessToken, { path: "/" });
  cookies.set("refreshToken", tokens.refreshToken, { path: "/" });
  cookies.set("expiresAt", tokens.accessTokenExpiredAt, { path: "/" }); // 액세스 토큰 만료 시간 저장
  return {
    type: LOGIN,
    payload: { tokens, user },
  };
};

export const logout = () => {
  // 쿠키에서 토큰 제거
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
  cookies.remove("expiresAt", { path: "/" }); // 액세스 토큰 만료 시간 제거
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

export const loginUserAction = values => async dispatch => {
  dispatch(showUserLoading());
  try {
    const response = await apiLoginUser(values);
    const { content } = response;

    // 토큰 정보 생성: accessTokenExpiredAt을 ISO 문자열로 변환
    const tokens = {
      accessToken: content.accessToken,
      refreshToken: cookies.get("refreshToken"),
      accessTokenExpiredAt: new Date(Date.now() + content.expiredIn * 1000).toISOString(),
    };
    const tokenPayload = JSON.parse(atob(tokens.accessToken.split(".")[1]));
    console.log("Token payload:", tokenPayload);
    // 쿠키에 토큰 저장
    cookies.set("accessToken", tokens.accessToken, { path: "/" });
    cookies.set("expiresAt", tokens.accessTokenExpiredAt, { path: "/" });
    // 타입 전송
    const computedUserType = tokenPayload.role.toLowerCase() + "s";
    // getMemberInfo 호출 시 에러 발생하면 빈 객체로 처리
    let user;
    try {
      user = await getMemberInfo(computedUserType);
    } catch (err) {
      console.error("Error fetching member info, defaulting to empty object:", err);
      user = {};
    }

    dispatch(login(tokens, user));
    dispatch(hideUserLoading());

    return { success: true };
  } catch (error) {
    dispatch(hideUserLoading());
    const message = error.response?.data?.message || "로그인 실패!";
    console.error("Error during login process:", error.response?.data || error);
    return { success: false, message };
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
