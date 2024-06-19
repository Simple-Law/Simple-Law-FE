import { createMail as apiCreateMail, fetchMails as apiFetchMails } from "apis/mailsApi";
import { SET_MAILS, SET_DATA, UPDATE_COUNTS, SET_TABLE_DATA } from "redux/types";

export const setMails = mails => ({
  type: SET_MAILS,
  payload: mails,
});

export const setData = data => ({
  type: SET_DATA,
  payload: data,
});

export const updateCounts = mails => ({
  type: UPDATE_COUNTS,
  payload: mails,
});

export const setTableData = data => ({
  type: SET_TABLE_DATA,
  payload: data,
});

export const fetchMailsAction = () => async dispatch => {
  try {
    const { data } = await apiFetchMails();

    dispatch(setData(data));
    dispatch(setMails(data.filter(mail => mail.status !== "휴지통")));
    dispatch(updateCounts(data));
    dispatch(setTableData(data));
  } catch (error) {
    console.error("Error fetching mails:", error);
  }
};

export const createMail = mailData => async dispatch => {
  const response = await apiCreateMail(mailData);
  const { data: fetchedMails } = await apiFetchMails();
  dispatch(setData(fetchedMails));
  dispatch(setMails(fetchedMails.filter(mail => mail.status !== "휴지통")));
  dispatch(updateCounts(fetchedMails));
  dispatch(setTableData(fetchedMails));
  return response;
};
