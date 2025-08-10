import axios, { AxiosInstance } from 'axios';

export const BASE = 'http://localhost:8000/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE,
});

export default axiosInstance;
