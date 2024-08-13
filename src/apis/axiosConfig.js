import axios from "axios";
import { store } from "../redux/store";
import { refreshAccessToken, logout } from "../redux/actions/authActions";
import Cookies from "universal-cookie";
import moment from "moment";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 새로운 액세스 토큰을 리프레시 토큰을 통해 얻는 함수
const getNewAccessToken = async userType => {
  const refreshToken = cookies.get("refreshToken");
  if (!refreshToken) {
    console.error("리프레시 토큰이 없습니다. 로그아웃 처리합니다.");
    store.dispatch(logout());
    return null;
  }

  const userPath = userType.toLowerCase() + "s";
  const url = `/api/v1/${userPath}/refresh-token`;

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

    console.log("새로운 액세스 토큰을 발급받았습니다!", newAccessToken);
    console.log("토큰 만료 시간을 업데이트했습니다!", accessTokenExpiredAt);

    store.dispatch(refreshAccessToken(newAccessToken));
    cookies.set("accessToken", newAccessToken, { path: "/" });
    cookies.set("expiresAt", accessTokenExpiredAt, { path: "/" });

    return newAccessToken;
  } catch (error) {
    console.error("액세스 토큰 갱신에 실패했습니다. 로그아웃 처리합니다.", error);
    cookies.remove("refreshToken", { path: "/" });
    store.dispatch(logout());
    return null;
  }
};

axiosInstance.interceptors.request.use(
  config => {
    const copyConfig = { ...config };
    if (!config.headers) return config;

    const token = cookies.get("accessToken");

    if (token && config.headers) {
      copyConfig.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
// 응답 인터셉터: 401 오류를 처리하여 새로운 액세스 토큰을 발급받음
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 Unauthorized 오류가 발생한 경우 새로운 액세스 토큰을 발급받음
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const userType = state.auth.user?.type;

      if (!userType) {
        console.error("사용자 유형이 정의되지 않았습니다. 로그아웃 처리합니다.");
        store.dispatch(logout());
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
        return Promise.reject(error);
      }

      const newAccessToken = await getNewAccessToken(userType);

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } else {
        console.error("액세스 토큰 갱신에 실패했습니다. 로그아웃 처리합니다.");
        store.dispatch(logout());
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
        return Promise.reject(error);
      }
    }

    // 액세스 토큰 갱신 시도 후에도 401 오류가 발생한 경우 로그아웃 처리
    if (error.response && error.response.status === 401 && originalRequest._retry) {
      console.error("토큰 갱신 실패로 로그아웃 처리합니다.");
      store.dispatch(logout());
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
