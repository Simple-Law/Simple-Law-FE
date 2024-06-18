import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  url: '/api/v1',
  // withCredentials : false,
});

export default axiosInstance;