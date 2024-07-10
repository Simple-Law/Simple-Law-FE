import {
  createMail as apiCreateMail,
  fetchMails as apiFetchMails,
  updateMail as apiUpdateMail,
  addReply as apiAddReply,
} from "apis/mailsApi";
import { SET_MAILS, SET_DATA, UPDATE_COUNTS, SET_TABLE_DATA, ADD_REPLY } from "../types";
import { showUserLoading, hideUserLoading } from "../../redux/actions/loadingAction";

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
  dispatch(showUserLoading());
  try {
    const { data } = await apiFetchMails();
    dispatch(setData(data));
    dispatch(setMails(data.filter(mail => mail.status !== "휴지통")));
    dispatch(updateCounts(data));
    dispatch(setTableData({ mails: data.filter(mail => mail.status !== "휴지통") }));
    dispatch(hideUserLoading());
  } catch (error) {
    console.error("Error fetching mails:", error);
    dispatch(hideUserLoading());
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

export const addReply = (id, reply) => async dispatch => {
  try {
    const updatedMail = await apiAddReply(id, reply);
    dispatch({
      type: ADD_REPLY,
      payload: { id, reply: updatedMail.replies },
    });
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

export const toggleImportant = id => async (dispatch, getState) => {
  const { data } = getState().mail;

  const updatedData = data.map(item => {
    if (item.id === id) {
      return {
        ...item,
        isImportant: !item.isImportant,
      };
    }
    return item;
  });

  const filteredMails = updatedData.filter(mail => mail.status !== "휴지통");

  dispatch(setData(updatedData));
  dispatch(setMails(filteredMails));
  dispatch(updateCounts(updatedData));
  dispatch(setTableData(filteredMails));

  try {
    const updatedItem = updatedData.find(item => item.id === id);
    await apiUpdateMail(id, { isImportant: updatedItem.isImportant });
  } catch (error) {
    console.error("중요 표시 업데이트 중 오류 발생:", error);
  }
};
