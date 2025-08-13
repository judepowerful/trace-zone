import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '../config'

const apiClient = axios.create({ baseURL: BACKEND_URL })

apiClient.interceptors.request.use(async (config) => {
  const userId = await AsyncStorage.getItem('userId')
  const token = await AsyncStorage.getItem('token')
  if (userId) config.headers['x-user-id'] = userId
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export default apiClient



