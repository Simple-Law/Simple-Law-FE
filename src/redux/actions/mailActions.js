import {
  createMail as apiCreateMail,
  fetchMails as apiFetchMails,
  updateMail as apiUpdateMail,
  addReply as apiAddReply,
} from "apis/mailsApi";
import { SET_MAILS, SET_DATA, UPDATE_COUNTS, SET_TABLE_DATA, ADD_REPLY, TOGGLE_IMPORTANT } from "../types";
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

export const fetchMailsAction = userType => async dispatch => {
  if (!userType) {
    console.error("Error: userType is undefined");
    return;
  }
  dispatch(showUserLoading());
  try {
    const { data } = await apiFetchMails(userType);
    dispatch(setData(data));
    dispatch(setMails(data.filter(mail => mail.status !== "trash")));
    dispatch(updateCounts(data));
    dispatch(setTableData({ mails: data.filter(mail => mail.status !== "trash") }));
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
  dispatch(setMails(fetchedMails.filter(mail => mail.status !== "trash")));
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
  const state = getState();
  const mail = state.mail.mails.find(mail => mail.caseKey === Number(id));

  if (!mail) {
    console.error(`Mail with id ${id} not found.`);
    return;
  }

  const updatedMail = { ...mail, isImportant: !mail.isImportant };

  try {
    await apiUpdateMail(id, { isImportant: updatedMail.isImportant });

    // 상태 업데이트
    const updatedData = state.mail.data.map(item => (item.caseKey === Number(id) ? updatedMail : item));

    const filteredMails = updatedData.filter(mail => mail.status !== "trash");

    dispatch({ type: SET_DATA, payload: updatedData });
    dispatch({ type: SET_MAILS, payload: filteredMails });
    dispatch({ type: UPDATE_COUNTS, payload: updatedData });
    dispatch({ type: SET_TABLE_DATA, payload: { mails: filteredMails } });

    dispatch({ type: TOGGLE_IMPORTANT, payload: updatedMail });
  } catch (error) {
    console.error("Error updating importance:", error);
  }
};
