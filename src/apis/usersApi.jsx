import axiosInstance from "./axiosConfig";

// 회원가입 API 함수
export const registerUser = async userData => {
  try {
    const endpoint = userData.type === "lawyer" ? "lawyers" : "members";
    const response = await axiosInstance.post(`/api/v1/${endpoint}/sign-up/email`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error);
    throw error;
  }
};

// 사용자 인증 API 함수 - 로그인
export const loginUser = async (credentials, userType) => {
  try {
    const endpoint = userType === "lawyer" ? "lawyers" : "members";
    const response = await axiosInstance.post(`/api/v1/${endpoint}/sign-in/email`, credentials);
    console.log("loginUser response:", response.data); // 응답 데이터 확인
    return response.data; // 실제 서버에서 반환하는 데이터를 그대로 반환
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    throw error;
  }
};

// 인증번호 발송 API 함수
export const sendAuthCode = async (phoneNumber, type) => {
  const endpoint = type === "lawyer" ? "lawyers" : "members";
  try {
    await axiosInstance.post(`/api/v1/${endpoint}/sign-up/send-sms`, { phoneNumber });
  } catch (error) {
    console.error("Error sending auth code:", error.response?.data || error);
    throw error;
  }
};

// 인증번호 확인 API 함수
export const verifyAuthCode = async (phoneNumber, verificationCode, type) => {
  const endpoint = type === "lawyer" ? "lawyers" : "members";
  try {
    await axiosInstance.post(`/api/v1/${endpoint}/sign-up/verify-sms`, {
      phoneNumber,
      verificationCode,
    });
  } catch (error) {
    console.error("Error verifying auth code:", error.response?.data || error);
    throw error;
  }
};

// 멤버 정보 가져오기 API 함수
export const getMemberInfo = async userType => {
  const endpoint = userType === "lawyer" ? "lawyers" : "members"; // 엔드포인트 설정
  try {
    const response = await axiosInstance.get(`/api/v1/${endpoint}/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching member info:", error.response?.data || error);
    throw error;
  }
};
