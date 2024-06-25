import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // withCredentials : false,
});
// Axios 요청 인터셉터를 사용하여 토큰을 자동으로 헤더에 추가
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
