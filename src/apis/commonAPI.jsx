import axiosInstance from "./axiosConfig";

/**
 * 역할 목록 조회 API
 * @param {Array} userTypeList 
 * @returns response
 */
export const getRoles = async userTypeList => {
  try {
    const response = await axiosInstance.get('/roles', {userTypeList: userTypeList.join(',')});
    return response;
  } catch (error) {
    console.error("Error fetching getRoles:", error);
    throw error;
  }
};