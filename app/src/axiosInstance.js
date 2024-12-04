import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://your-backend-api-url', // 這裡替換為你的後端 API 基本 URL
  timeout: 10000,
});

export default axiosInstance;
