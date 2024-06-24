import { loginUser as apiLoginUser, getMemberInfo } from "apis/usersApi";
import { LOGIN, LOGOUT, SET_USER_INFO } from "../types";

export const login = (tokens, user) => ({
  type: LOGIN,
  payload: { tokens, user },
});

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const logout = () => ({
  type: LOGOUT,
});

// 비동기 Thunk 함수
export const loginUser = (values, userType) => async dispatch => {
  try {
    const response = await apiLoginUser(values, userType);
    const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt, ...user } = response.data.payload;
    const tokens = {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };

    dispatch(login(tokens, user));

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessTokenExpiredAt", accessTokenExpiredAt);
    localStorage.setItem("refreshTokenExpiredAt", refreshTokenExpiredAt);

    // TODO: DY - api완성 시 활성화
    // const memberInfoResponse = await getMemberInfo(userType);
    // dispatch(setUserInfo(memberInfoResponse.data.payload));

    return { success: true }; // 성공 시 객체 반환
  } catch (error) {
    console.error("Error during login process:", error.response?.data || error); // 오류 로그 추가
    return { success: false, message: error.message }; // 실패 시 객체 반환
  }
};
