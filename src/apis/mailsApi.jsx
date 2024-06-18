import axios from "axios";
import moment from "moment";

const glitchURL = axios.create({
  baseURL: process.env.REACT_APP_GLITCH_URL,
});

export const fetchMails = async () => {
  try {
    const response = await glitchURL.get("/mails");
    const formattedData = response.data
      .map(item => ({
        ...item,
        key: item.id,
        category: "Text",
        rawSentAt: item.sentAt,
        sentAt: moment(item.sentAt).format("YYYY. MM. DD"),
        time: item.time,
      }))
      .sort((a, b) => moment(b.rawSentAt).diff(moment(a.rawSentAt)));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }
};

export const updateMail = async (id, updateData) => {
  try {
    await glitchURL.patch(`/mails/${id}`, updateData);
  } catch (error) {
    console.error("Error updating mail:", error);
  }
};

export const createMail = async mailData => {
  try {
    const response = await glitchURL.post("/mails", mailData);
    return response.data;
  } catch (error) {
    console.error("Error creating mail:", error);
    throw error;
  }
};

export const getMailById = async id => {
  try {
    const response = await glitchURL.get(`/mails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail by id:", error);
    throw error;
  }
};
