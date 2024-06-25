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
    case "LOGIN":
      return {
        ...state,
        tokens: action.payload.tokens,
        user: action.payload.user,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
