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
 * 파일을 다운로드하는 API
 * @param {String} fileId - 다운로드할 파일의 ID
 * @returns {Promise}
 */
export const downloadFile = async fileId => {
  console.log(fileId);
  try {
    const response = await axiosInstance.get(`/api/v1/files/${fileId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    let fileName = `${fileId}.pdf`;

    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

/**
 * 모든 파일을 다운로드하는 함수
 * @param {Array} files - 다운로드할 파일 목록
 */
export const downloadAllFiles = async files => {
  for (const file of files) {
    await downloadFile(file.fileId);
  }
};
