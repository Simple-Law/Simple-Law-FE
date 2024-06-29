import { HIDE_LOADING, SHOW_LOADING } from "../types";

export const showLoading = () => ({
  type: SHOW_LOADING,
});

export const hideLoading = () => ({
  type: HIDE_LOADING,
});

export const delayedShowLoading = () => {
  return dispatch => {
    const timeoutId = setTimeout(() => {
      dispatch(showLoading());
    }, 2000); // 3초 후에 로딩 표시

    return timeoutId;
  };
};

export const clearLoadingTimeout = timeoutId => {
  return dispatch => {
    clearTimeout(timeoutId);
    dispatch(hideLoading());
  };
};
