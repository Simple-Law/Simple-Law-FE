import axios from "axios";
import moment from "moment";

const baseURL = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// 회원가입 API 함수
export const registerUser = async userData => {
  try {
    const registrationDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = await baseURL.post("/users", { ...userData, registrationDate });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// 로그인 API 함수
export const loginUser = async (credentials, userType) => {
  try {
    const response = await baseURL.get("/users");
    const users = response.data;

    const { id, password } = credentials;
    const user = users.find(u => u.id === id && u.password === password && u.type === userType);

    if (!user) {
      throw new Error("존재하지 않는 아이디입니다.");
    }
    if (user.status !== "approved") {
      throw new Error("가입 승인 중입니다.");
    }
    // 로그인 성공 시, 토큰 대신 사용자 정보를 반환
    return { token: "mock-token", user };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
