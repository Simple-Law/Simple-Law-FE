import axiosInstance from "./axiosConfig";

/**
 * 역할 목록 조회 API (사용X userTypes 로 대체)
 * @param {Array} params
 * @returns response
 */
export const getRoles = async params => {
  try {
    const response = await axiosInstance.get("/api/v1/roles", { params });
    return response;
  } catch (error) {
    console.error("Error fetching getRoles:", error);
    throw error;
  }
};

/**
 * 카테고리 목록 조회 API
 * @returns response
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/categories/case");
    return response;
  } catch (error) {
    console.error("Error fetching getCategories:", error);
    throw error;
  }
};
/**
 * 파일 업로드 API
 * @param {File[]} files - 업로드할 파일 목록
 * @returns response
 */
export const uploadFile = async formData => {
  try {
    const response = await axiosInstance.post("/api/v1/files", formData, {
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

/**
 * 파일 삭제 API
 * @param {string} url - 삭제할 파일 URL
 * @returns response
 */
export const deleteFile = async url => {
  try {
    const response = await axiosInstance.delete("/api/v1/files", { data: { url } });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error.response?.data || error);
    throw error;
  }
};

/**
 * 파일 다운로드 API
 * @param {string} fileId - 다운로드할 파일 아이디
 * @returns response
 */
export const downloadFile = async fileId => {
  try {
    const response = await axiosInstance.post(`/api/v1/files/${fileId}`, null, {
      responseType: "blob", // 파일 다운로드를 위한 설정
    });

    // 파일 다운로드
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", response.headers["content-disposition"].split("filename=")[1]);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
