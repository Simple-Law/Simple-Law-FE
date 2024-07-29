import moment from "moment";
import { formatDate } from "utils/dateUtil";
import axiosInstance from "./axiosConfig";

/**
 * 의뢰 목록을 가져오는 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @returns {Promise}
 */
export const fetchMails = async (userType, params) => {
  const userPath = userType && userType.toLowerCase() + "s"; // 기본값 설정
  console.log("userPath", userPath);
  try {
    const response = await axiosInstance.get(`/api/v1/${userPath}/cases`, { params });
    console.log(response.data.data);
    const formattedData = response.data.data.payload
      .map(item => ({
        ...item,
        key: item.caseKey,
        category: item.mainCaseCategoryName,
        subCategory: item.subCaseCategoryName,
        rawRequestedAt: item.requestedAt,
        requestedAt: formatDate(item.requestedAt),
        status: item.displayStatus,
        additionList: item.additionList,
        contentFileList: item.contentFileList,
      }))
      .sort((a, b) => moment(b.rawRequestedAt).diff(moment(a.rawRequestedAt)));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }
};

/**
 * 의뢰 상세 정보를 가져오는 API
 * @param {Number} caseKey - 가져올 의뢰의 케이스 키
 * @returns {Promise} 의뢰의 데이터
 */
export const getMailById = async (userType, caseKey) => {
  const userPath = userType.toLowerCase() + "s";
  const url = `/api/v1/${userPath}/cases/${caseKey}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data.data.payload;
  } catch (error) {
    console.error("Error fetching mail by id:", error);
    throw error;
  }
};

/**
 * 메일을 업데이트하는 API
 * @param {Number} id - 업데이트할 메일의 ID
 * @param {Object} updateData - 업데이트할 데이터 객체
 * @returns {Promise}
 */
export const updateMail = async (id, updateData) => {
  try {
    await axiosInstance.patch(`/api/v1/members/cases/${id}`, updateData);
  } catch (error) {
    console.error("Error updating mail:", error);
    throw error;
  }
};

/**
 * 새로운 메일을 생성하는 API
 * @param {Object} mailData - 생성할 메일의 데이터 객체
 * @returns {Promise} 생성된 메일의 데이터
 */

export const createMail = async requestData => {
  try {
    const response = await axiosInstance.post("/api/v1/members/cases", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

/**
 * 의뢰에 추가 요청을 추가하는 API
 * @param {Number} caseKey - 추가 요청을 추가할 의뢰의 케이스 키
 * @param {Object} additionData - 추가할 요청의 데이터 객체
 * @returns {Promise} 업데이트된 의뢰의 데이터
 */
export const addReply = async (caseKey, additionData) => {
  try {
    const response = await axiosInstance.post(`/api/v1/members/cases/${caseKey}/additions`, additionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};

/**
 * 세부 분야 카테고리를 가져오는 API
 * @returns {Promise<Array>} 세부 분야 카테고리 목록
 * @throws {Error} 데이터를 가져오는 도중 발생한 오류
 */
export const fetchCaseCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/categories/case");
    return response.data.data.payload;
  } catch (error) {
    console.error("Error fetching case categories:", error);
    throw error;
  }
};
