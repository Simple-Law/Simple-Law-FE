const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  accessTokenExpiredAt: localStorage.getItem("accessTokenExpiredAt"),
  refreshTokenExpiredAt: localStorage.getItem("refreshTokenExpiredAt"),
  user: JSON.parse(localStorage.getItem("user")),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": {
      const { tokens, user } = action.payload;
      const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt } = tokens;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessTokenExpiredAt", accessTokenExpiredAt);
      localStorage.setItem("refreshTokenExpiredAt", refreshTokenExpiredAt);
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        accessToken,
        refreshToken,
        accessTokenExpiredAt,
        refreshTokenExpiredAt,
        user,
      };
    }
    case "SET_USER_INFO":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpiredAt");
      localStorage.removeItem("refreshTokenExpiredAt");
      localStorage.removeItem("user");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        accessTokenExpiredAt: null,
        refreshTokenExpiredAt: null,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
