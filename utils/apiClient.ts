// utils/apiClient.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from './config';

// 创建带身份信息的 axios 实例
const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

// 请求拦截器：自动加上 x-user-id
apiClient.interceptors.request.use(async (config) => {
  const userId = await AsyncStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

export default apiClient;
