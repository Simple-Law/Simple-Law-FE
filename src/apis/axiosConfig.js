import axios from "axios";
import { store } from "../redux/store";
import { refreshAccessToken } from "../redux/actions/authActions";
import { logout } from "../redux/actions/authActions";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = cookies.get("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

const getNewAccessToken = async () => {
  const refreshToken = cookies.get("refreshToken");

  if (refreshToken) {
    try {
      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken: refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      store.dispatch(refreshAccessToken(newAccessToken));
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      store.dispatch(logout());
      return null;
    }
  }

  return null;
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await getNewAccessToken();

      if (newAccessToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
