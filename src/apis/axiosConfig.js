import axios from "axios";
import { store } from "../redux/store";
import { refreshAccessToken, logout } from "../redux/actions/authActions";
import Cookies from "universal-cookie";
import moment from "moment";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const getNewAccessToken = async userType => {
  const refreshToken = cookies.get("refreshToken");
  const userPath = userType.toLowerCase() + "s";
  const url = `/api/v1/${userPath}/refresh-token`;

  console.log("리프레시 토큰", refreshToken);
  if (refreshToken) {
    try {
      const response = await axiosInstance.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const newAccessToken = response.data.data.payload.token.accessToken;
      const accessTokenExpiredAt = response.data.data.payload.token.accessTokenExpiredAt;
      console.log("토큰 재발급!", newAccessToken);
      console.log("토큰 기간 수정!", accessTokenExpiredAt);

      store.dispatch(refreshAccessToken(newAccessToken));
      cookies.set("accessToken", newAccessToken, { path: "/" });
      cookies.set("expiresAt", accessTokenExpiredAt, { path: "/" });

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      cookies.remove("refreshToken", { path: "/" });
      store.dispatch(logout());
      return null;
    }
  }

  return null;
};

// axiosInstance.interceptors.request.use(
//   async config => {
//     const token = cookies.get("accessToken");
//     const refreshToken = cookies.get("refreshToken");
//     let expireAt = cookies.get("expiresAt");

//     if (token) {
//       if (moment(expireAt).isBefore(moment()) && refreshToken) {
//         console.log("액세스 토큰이 만료되었습니다. 리프레시 토큰을 사용하여 새로운 토큰을 발급받습니다.");
//         const state = store.getState();
//         const userType = state.auth.user?.type;

//         const newAccessToken = await getNewAccessToken(userType);
//         if (newAccessToken) {
//           config.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         } else {
//           store.dispatch(logout());
//           cookies.remove("accessToken", { path: "/" });
//           cookies.remove("refreshToken", { path: "/" });
//         }
//       } else {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 응답이 반환된 경우 새로운 액세스 토큰을 발급받음
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const userType = state.auth.user?.type;

      const newAccessToken = await getNewAccessToken(userType);

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } else {
        store.dispatch(logout());
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
      }
    }

    if (error.response && error.response.status === 401 && originalRequest._retry) {
      store.dispatch(logout());
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
