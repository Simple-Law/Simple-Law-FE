import axios from "axios";

const baseURL = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});
const joinURL = axios.create({
  baseURL: "https://api.cimplelaw.co.kr",
});
// Axios 요청 인터셉터를 사용하여 토큰을 자동으로 헤더에 추가
joinURL.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// 회원가입 API 함수
export const registerUser = async userData => {
  try {
    const endpoint = userData.type === "lawyer" ? "lawyers" : "members";
    const response = await joinURL.post(`/api/v1/${endpoint}/sign-up/email`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error);
    throw error;
  }
};

// 인증번호 발송 API 함수
export const sendAuthCode = async (phoneNumber, type) => {
  const endpoint = type === "lawyer" ? "lawyers" : "members";
  try {
    await joinURL.post(`/api/v1/${endpoint}/sign-up/send-sms`, { phoneNumber });
  } catch (error) {
    console.error("Error sending auth code:", error.response?.data || error);
    throw error;
  }
};

// 인증번호 확인 API 함수
export const verifyAuthCode = async (phoneNumber, verificationCode, type) => {
  const endpoint = type === "lawyer" ? "lawyers" : "members";
  try {
    await joinURL.post(`/api/v1/${endpoint}/sign-up/verify-sms`, {
      phoneNumber,
      verificationCode,
    });
  } catch (error) {
    console.error("Error verifying auth code:", error.response?.data || error);
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
      throw new Error("로그인에 실패했습니다.");
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
// 파일 업로드 API 함수

export const uploadFile = async formData => {
  try {
    const response = await joinURL.post("/api/v1/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error.response?.data || error);
    throw error;
  }
};
