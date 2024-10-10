import {
  createMail as apiCreateMail,
  fetchMails as apiFetchMails,
  addReply as apiAddReply,
  markAsImportant,
  unMarkAsImportant,
  fetchTrashMails as apiFetchTrashMails,
  deleteTrashMails as apiDeleteTrashMails,
} from "apis/mailsApi";

import { SET_MAILS, ADD_REPLY, TOGGLE_IMPORTANT } from "../types";
import { showUserLoading, hideUserLoading } from "../../redux/actions/loadingAction";

export const fetchMailsAction = userType => async dispatch => {
  if (!userType) {
    return;
  }
  dispatch(showUserLoading());
  try {
    const { data } = await apiFetchMails(userType);

    dispatch(setMails(data));

    dispatch(hideUserLoading());
  } catch (error) {
    console.error("Error fetching mails:", error);
    dispatch(hideUserLoading());
  }
};
export const setMails = mails => ({
  type: SET_MAILS,
  payload: mails,
});

export const createMail = mailData => async dispatch => {
  const response = await apiCreateMail(mailData);
  const { data: fetchedMails } = await apiFetchMails();

  dispatch(setMails(fetchedMails));

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

  const isCurrentlyImportant = mail.isImportant;
  const updatedMail = { ...mail, isImportant: !mail.isImportant };

  try {
    if (isCurrentlyImportant) {
      await unMarkAsImportant(id);
    } else {
      await markAsImportant(id);
    }

    // 상태 업데이트
    const updatedData = state.mail.mails.map(item => (item.caseKey === Number(id) ? updatedMail : item));

    dispatch({ type: SET_MAILS, payload: updatedData });
    dispatch({ type: TOGGLE_IMPORTANT, payload: updatedMail });
  } catch (error) {
    console.error("Error toggling importance:", error);
  }
};

// 휴지통 목록을 불러오는 액션
export const fetchTrashMailsAction = () => async dispatch => {
  try {
    const trashMails = await apiFetchTrashMails();
    dispatch({
      type: "SET_TRASH_MAILS",
      payload: trashMails,
    });
  } catch (error) {
    console.error("Error fetching trash mails:", error);
  }
};

// 휴지통에서 메일을 영구 삭제하는 액션
export const deleteTrashMailAction = caseKey => async dispatch => {
  try {
    await apiDeleteTrashMails(caseKey);
    dispatch({
      type: "DELETE_TRASH_MAIL",
      payload: caseKey,
    });
  } catch (error) {
    console.error("Error deleting trash mail:", error);
  }
};
