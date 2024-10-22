import axiosInstance from "./axiosConfig";

/**
 * 관리자 의뢰 목록 조회 API
 * @param {Object} params
 * @returns {Promise}
 */
export const getRequestList = async params => {
  const response = await axiosInstance.get("/api/v1/admins/cases", { params });
  return response;
};
