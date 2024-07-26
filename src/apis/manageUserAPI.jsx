import axiosInstance from "./axiosConfig";

/**
 * 관리자 계정관리 목록 조회 API
 * @param {Object} params : 검색조건
 * @returns {promise} 응답 객체
 */
export const searchAdminAPI = params => {
  try {
    const response = axiosInstance.get("/api/v1/admins", { params });
    return response;
  } catch (error) {
    console.error("Error fetching searchAdminAPI:", error);
  }
};

/**
 * 회원관리 목록 조회 API
 * @param {*} params : 검색조건
 * @returns {promise} 응답 객체
 */
export const searchUserAPI = params => {
  console.log("searchUserAPI params:", params);
  try {
    const response = axiosInstance.get("/api/v1/admins/users", params);
    return response;
  } catch (error) {
    console.error("Error fetching searchUserAPI:", error);
  }
};
