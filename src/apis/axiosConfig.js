import axios from "axios";
import { store } from "../redux/store";
import { showLoading, hideLoading } from "../redux/actions/loadingAction";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // withCredentials : false,
});

// Axios 요청 인터셉터를 사용하여 토큰을 자동으로 헤더에 추가
axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.tokens.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    store.dispatch(showLoading()); // 요청 전 로딩 표시

    return config;
  },
  error => {
    store.dispatch(hideLoading()); // 요청 오류 발생 시 로딩 숨김
    return Promise.reject(error);
  },
);

// Axios 응답 인터셉터를 사용하여 로딩 상태를 제어
axiosInstance.interceptors.response.use(
  response => {
    store.dispatch(hideLoading()); // 응답 성공 시 로딩 숨김
    return response;
  },
  error => {
    store.dispatch(hideLoading()); // 응답 오류 발생 시 로딩 숨김
    return Promise.reject(error);
  },
);

export default axiosInstance;
