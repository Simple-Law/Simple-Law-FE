import { SHOW_USER_LOADING, HIDE_USER_LOADING, SHOW_MAIL_LOADING, HIDE_MAIL_LOADING } from "../types";

export const showUserLoading = () => ({
  type: SHOW_USER_LOADING,
});

export const hideUserLoading = () => ({
  type: HIDE_USER_LOADING,
});

export const showMailLoading = () => ({
  type: SHOW_MAIL_LOADING,
});

export const hideMailLoading = () => ({
  type: HIDE_MAIL_LOADING,
});
