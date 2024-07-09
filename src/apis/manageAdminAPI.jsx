import axiosInstance from "./axiosConfig";

/**
 * 관리자 계정관리 목록 조회 API
 * @param {Object} params
 * @returns
 */
export const getAdminsApi = params => {
  try {
    const response = axiosInstance.get("/api/v1/admins", { params });
    return response;
  } catch (error) {
    console.error("Error fetching getAdminsApi:", error);
  }
};

/**
 * 관리자 생성 API
 * @param {Object} adminData
 * @returns response
 */
export const insertAdmin = adminData => {
  try {
    const response = axiosInstance.post("/api/v1//admins", adminData);
    return response;
  } catch (error) {
    console.error("Error fetching insertAdmin:", error);
  }
};

/**
 * 관리자 수정 API
 * @param {Number} adminKey
 * @param {Object} adminData
 * @returns response
 */
export const updateAdmin = (adminKey, adminData) => {
  try {
    const response = axiosInstance.put(`/api/v1//admins/${adminKey}`, adminData);
    return response;
  } catch (error) {
    console.error("Error fetching updateAdmin:", error);
  }
};
