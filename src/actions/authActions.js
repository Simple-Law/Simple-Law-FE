import { loginUser as apiLoginUser } from "apis/usersApi";

export const login = (tokens, user) => ({
  type: "LOGIN",
  payload: { tokens, user },
});

export const logout = () => ({
  type: "LOGOUT",
});

export const loginUser = (values, userType) => async dispatch => {
  try {
    const response = await apiLoginUser(values, userType);
    dispatch(login(response.data.payload, response.data.payload)); // 액세스 토큰 및 사용자 정보 저장
    return { success: true }; // 성공 시 객체 반환
  } catch (error) {
    return { success: false, message: error.message }; // 실패 시 객체 반환
  }
};
