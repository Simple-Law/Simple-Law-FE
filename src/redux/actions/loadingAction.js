import {
  SHOW_USER_LOADING,
  HIDE_USER_LOADING,
  SHOW_MAIL_LOADING,
  HIDE_MAIL_LOADING,
  SHOW_SKELETON_LOADING,
  HIDE_SKELETON_LOADING,
} from "../types";

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

export const showSkeletonLoading = () => ({
  type: SHOW_SKELETON_LOADING,
});

export const hideSkeletonLoading = () => ({
  type: HIDE_SKELETON_LOADING,
});
