import {
  SHOW_USER_LOADING,
  HIDE_USER_LOADING,
  SHOW_MAIL_LOADING,
  HIDE_MAIL_LOADING,
  SHOW_SKELETON_LOADING,
  HIDE_SKELETON_LOADING,
} from "../types";
const initialState = {
  userLoading: false,
  mailLoading: false,
  SkeletonLoading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_USER_LOADING:
      return { ...state, userLoading: true };
    case HIDE_USER_LOADING:
      return { ...state, userLoading: false };
    case SHOW_MAIL_LOADING:
      return { ...state, mailLoading: true };
    case HIDE_MAIL_LOADING:
      return { ...state, mailLoading: false };
    case SHOW_SKELETON_LOADING:
      return { ...state, SkeletonLoading: true };
    case HIDE_SKELETON_LOADING:
      return { ...state, SkeletonLoading: false };
    default:
      return state;
  }
};

export default loadingReducer;
