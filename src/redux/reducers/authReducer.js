const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: JSON.parse(localStorage.getItem("user")),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      // eslint-disable-next-line no-case-declarations
      const { accessToken, refreshToken, user, accessTokenExpiredAt, refreshTokenExpiredAt } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessTokenExpiredAt", accessTokenExpiredAt);
      localStorage.setItem("refreshTokenExpiredAt", refreshTokenExpiredAt);
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        accessToken,
        refreshToken,
        user,
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
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
