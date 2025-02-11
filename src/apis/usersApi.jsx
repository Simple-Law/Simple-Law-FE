import axiosInstance from "./axiosConfig";

/**
 * 관리자 생성 API
 * @param {Object} adminData - 관리자의 데이터 객체
 * @returns {Promise} 응답 객체
 */
export const postAdminAPI = adminData => {
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
export const putAdminAPI = (adminKey, adminData) => {
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
    const transformedData = { ...userData };
    delete transformedData.type;

    const url = `/api/v1/auth/${userData.type}/sign-up`;
    const response = await axiosInstance.post(url, transformedData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error);
    throw error;
  }
};

/**
 * 사용자 인증 API 함수 - 로그인
 * @param {Object} credentials - 로그인 자격 증명 객체
 * @returns {Promise} 응답 데이터
 */

export const loginUser = async credentials => {
  try {
    const response = await axiosInstance.post(`/api/v1/auth/login`, credentials);
    console.log("loginUser response:", response.data); // 응답 데이터 확인
    return response.data; // 실제 서버에서 반환하는 데이터를 그대로 반환
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    throw error;
  }
};

/**
 * 사용자 정보 가져오기 API 함수
 * @param {String} userType - 사용자 유형 (admin, lawyer, clients)
 * @returns {Promise} 응답 데이터
 */

export const getMemberInfo = async userType => {
  try {
    const response = await axiosInstance.get(`/api/v1/${userType}/profile`);
    return { ...response.data.content, type: userType };
  } catch (error) {
    console.error("Error fetching member info:", error.response?.data || error);
    throw error;
  }
};

/**
 * 이메일 중복 검사 API 함수
 * @param {String} email - 검사할 이메일
 * @returns {Promise<Boolean>} 가입된 이메일이면 true, 아니면 false
 */
export const checkEmailExist = async email => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/exist/email", { email });
    // response.data.content.exist 가 true/false를 반환
    return response.data.content.exist;
  } catch (error) {
    console.error("Error checking email duplicate:", error.response?.data || error);
    throw error;
  }
};
