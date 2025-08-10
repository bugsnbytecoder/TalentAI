import axios, { AxiosInstance } from 'axios';

export const BASE = 'https://talentaibackend-b5epc9h8e5grg5bx.centralus-01.azurewebsites.net/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE,
});

export default axiosInstance;
