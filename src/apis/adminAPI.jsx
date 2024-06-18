import axiosInstance from "./axiosConfig";

/**
 * 관리자 생성 API
 * @param {Object} adminData 
 * @returns response
 */
export const insertAdmin = (adminData) =>{
  try {
    const response = axiosInstance.post('/admins', adminData);
    return response;
  } catch (error) {
    console.error("Error fetching insertAdmin:", error);
  }
}

/**
 * 관리자 수정 API
 * @param {Number} adminKey 
 * @param {Object} adminData 
 * @returns response
 */
export const updateAdmin = (adminKey, adminData) =>{
  try {
    const response = axiosInstance.put(`/admins/${adminKey}`, adminData);
    return response;
  } catch (error) {
    console.error("Error fetching updateAdmin:", error);
  }
}