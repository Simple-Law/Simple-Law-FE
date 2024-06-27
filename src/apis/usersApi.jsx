import axiosInstance from "./axiosConfig";

/**
 * 관리자 생성 API
 * @param {Object} adminData - 관리자의 데이터 객체
 * @returns {Promise} 응답 객체
 */
export const insertAdmin = adminData => {
  try {
    const response = axiosInstance.post("/api/v1/admins", adminData);
    return response;
  } catch (error) {
    console.error("Error fetching insertAdmin:", error);
  }
};

/**
 * 관리자 수정 API
 * @param {Number} adminKey - 수정할 관리자의 키
 * @param {Object} adminData - 관리자의 수정된 데이터 객체
 * @returns {Promise} 응답 객체
 */
export const updateAdmin = (adminKey, adminData) => {
  try {
    const response = axiosInstance.put(`/api/v1/admins/${adminKey}`, adminData);
    return response;
  } catch (error) {
    console.error("Error fetching updateAdmin:", error);
  }
};

/**
 * 회원가입 API 함수
 * @param {Object} userData - 사용자의 데이터 객체
 * @returns {Promise} 응답 데이터
 */
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

/**
 * 사용자 인증 API 함수 - 로그인
 * @param {Object} credentials - 로그인 자격 증명 객체
 * @param {String} userType - 사용자 유형 (admin, lawyer, member)
 * @returns {Promise} 응답 데이터
 */
export const loginUser = async (credentials, userType) => {
  try {
    const endpoint = userType === "admin" ? "admins" : userType === "lawyer" ? "lawyers" : "members";
    const response = await axiosInstance.post(`/api/v1/${endpoint}/sign-in/email`, credentials);
    console.log("loginUser response:", response.data); // 응답 데이터 확인
    return response.data; // 실제 서버에서 반환하는 데이터를 그대로 반환
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    throw error;
  }
};

/**
 * 사용자 정보 가져오기 API 함수
 * @param {String} userType - 사용자 유형 (admin, lawyer, member)
 * @returns {Promise} 응답 데이터
 */
export const getMemberInfo = async userType => {
  const endpoint = userType === "admin" ? "admins" : userType === "lawyer" ? "lawyers" : "members"; // 엔드포인트 설정
  try {
    const response = await axiosInstance.get(`/api/v1/${endpoint}/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching member info:", error.response?.data || error);
    throw error;
  }
};

/**
 * 인증번호 발송 API 함수
 * @param {String} phoneNumber - 사용자의 전화번호
 * @param {String} type - 사용자 유형 (lawyer, member)
 * @returns {Promise} 응답 객체
 */
export const sendAuthCode = async (phoneNumber, type) => {
  const endpoint = type === "lawyer" ? "lawyers" : "members";
  try {
    await axiosInstance.post(`/api/v1/${endpoint}/sign-up/send-sms`, { phoneNumber });
  } catch (error) {
    console.error("Error sending auth code:", error.response?.data || error);
    throw error;
  }
};

/**
 * 인증번호 확인 API 함수
 * @param {String} phoneNumber - 사용자의 전화번호
 * @param {String} verificationCode - 인증번호
 * @param {String} type - 사용자 유형 (lawyer, member)
 * @returns {Promise} 응답 객체
 */
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

// 임시 중복 검사 API (특정 값만 중복)
const duplicateIds = ["didi123", "quest1", "lawyer123"];
const duplicateEmails = ["didi123@naver.com", "quest1@naver.com", "lawyer123@naver.com"];

export const checkDuplicate = async (type, value) => {
  if (type === "id") {
    return duplicateIds.includes(value);
  }
  if (type === "email") {
    return duplicateEmails.includes(value);
  }
  return false;
};
