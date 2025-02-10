import axios from "axios";
import { store } from "../redux/store";
import { refreshAccessToken, logout } from "../redux/actions/authActions";
import Cookies from "universal-cookie";
import moment from "moment";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// 새로운 액세스 토큰을 리프레시 토큰을 통해 얻는 함수
const getNewAccessToken = async userType => {
  const refreshToken = cookies.get("refreshToken");
  if (!refreshToken) {
    console.error("리프레시 토큰이 없습니다. 로그아웃 처리합니다.");
    store.dispatch(logout());
    return null;
  }

  const url = `/api/v1/auth/token/refresh`;
  console.log("UserType:", userType);
  console.log("Refresh URL:", url);

  try {
    const currentAccessToken = cookies.get("accessToken") || "";
    const response = await axiosInstance.post(
      url,
      { accessToken: currentAccessToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    const { content } = response.data;
    const newAccessToken = content.accessToken;
    const expiredIn = content.expiredIn; // 초 단위 유효 시간

    // expiredIn(초)를 기반으로 만료 시간을 계산하고 ISO 문자열로 변환
    const accessTokenExpiredAt = new Date(Date.now() + expiredIn * 1000).toISOString();

    // Redux 스토어와 쿠키에 갱신된 토큰 정보 저장
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
    const token = cookies.get("accessToken");
    const expiresAt = cookies.get("expiresAt");

    // 토큰이 존재하고 만료되지 않았다면 헤더에 추가
    if (token && expiresAt && moment().isBefore(moment(expiresAt))) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 오류 발생 시 (토큰 만료 등) 단 한 번만 재시도하도록 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const userType = state.auth.user?.type;
      console.log("User type for token refresh:", userType);
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

    // 토큰 갱신 시도 후에도 401 오류가 발생하면 로그아웃 처리
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
