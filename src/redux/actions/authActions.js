import { loginUser as apiLoginUser } from "apis/usersApi";
import { LOGIN, LOGOUT } from "../types";

export const login = (tokens, user) => ({
  type: LOGIN,
  payload: { tokens, user },
});

export const logout = () => ({
  type: LOGOUT,
});

// 비동기 Thunk 함수
export const loginUser = (values, userType) => async dispatch => {
  try {
    const response = await apiLoginUser(values, userType);
    const { token: tokens, user } = response.data.payload;

    dispatch(login(tokens, user));

    return { success: true }; // 성공 시 객체 반환
  } catch (error) {
    const message = error.response?.data?.message || "로그인 실패!";
    console.error("Error during login process:", error.response?.data || error); // 오류 로그 추가
    return { success: false, message: message }; // 실패 시 오류 메시지 반환
  }
};
