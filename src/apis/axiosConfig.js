import axios from "axios";
import { store } from "../redux/store";

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

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Axios 응답 인터셉터를 사용하여 응답을 처리
axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export default axiosInstance;
