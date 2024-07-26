import axiosInstance from "./axiosConfig";

/**
 * 관리자 계정관리 목록 조회 API
 * @param {Object} params
 * @returns
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
 * 관리자 생성 API
 * @param {Object} params
 * @returns response
 */
export const postAdminAPI = params => {
  try {
    const response = axiosInstance.post("/api/v1/admins", params);
    return response;
  } catch (error) {
    console.error("Error fetching postAdminAPI:", error);
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
