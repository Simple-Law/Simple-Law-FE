import { LOGIN, LOGOUT, REFRESH_ACCESS_TOKEN } from "../types";
const initialState = {
  user: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
    accessTokenExpiredAt: null,
    refreshTokenExpiredAt: null,
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        tokens: action.payload.tokens,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        tokens: initialState.tokens,
        user: initialState.user,
      };
    case REFRESH_ACCESS_TOKEN:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          accessToken: action.payload,
        },
      };
    default:
      return state;
  }
};

export default authReducer;
