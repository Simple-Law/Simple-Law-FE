import axios from "axios";
import moment from "moment";
import { formatDate } from "utils/dateUtil";

const glitchURL = axios.create({
  baseURL: process.env.REACT_APP_GLITCH_URL,
});
/**
 * 메일을 가져오는 API
 * @returns {Promise}
 */
export const fetchMails = async () => {
  try {
    const response = await glitchURL.get("/mails");
    const formattedData = response.data
      .map(item => ({
        ...item,
        key: item.id,
        category: "Text",
        rawSentAt: item.sentAt,
        sentAt: formatDate(item.sentAt),
        time: item.time,
        replies: item.replies || [],
      }))
      .sort((a, b) => moment(b.rawSentAt).diff(moment(a.rawSentAt)));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
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
    await glitchURL.patch(`/mails/${id}`, updateData);
  } catch (error) {
    console.error("Error updating mail:", error);
  }
};
/**
 * 새로운 메일을 생성하는 API
 * @param {Object} mailData - 생성할 메일의 데이터 객체
 * @returns {Promise} 생성된 메일의 데이터
 */
export const createMail = async mailData => {
  try {
    const response = await glitchURL.post("/mails", mailData);
    return response.data;
  } catch (error) {
    console.error("Error creating mail:", error);
    throw error;
  }
};
/**
 * ID로 메일을 가져오는 API
 * @param {Number} id - 가져올 메일의 ID
 * @returns {Promise} 메일의 데이터
 */
export const getMailById = async id => {
  try {
    const response = await glitchURL.get(`/mails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail by id:", error);
    throw error;
  }
};
/**
 * 메일에 답변을 추가하는 API
 * @param {Number} id - 회신을 추가할 메일의 ID
 * @param {String} reply - 추가할 회신 내용
 * @returns {Promise} 업데이트된 메일의 데이터
 */
export const addReply = async (id, reply) => {
  try {
    // 기존 메일 데이터를 가져옴
    const mail = await getMailById(id);

    // replies 배열이 없는 경우 초기화
    const updatedReplies = mail.replies ? [...mail.replies, reply] : [reply];

    // 메일 업데이트
    const response = await glitchURL.patch(`/mails/${id}`, {
      replies: updatedReplies,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};
