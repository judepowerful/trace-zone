import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import apiClient from './apiClient';

// ✅ 注册用户
export const registerUser = async (userId: string) => {
  try {
    await apiClient.post('/api/users/register', { userId });
  } catch (err) {
    console.warn('用户注册失败', err);
  }
};

// ✅ 得到用户ID（首次生成并注册）
export const getOrCreateUserId = async (): Promise<string> => {
  let id = await AsyncStorage.getItem('userId');
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem('userId', id);
    await registerUser(id);
  }
  return id;
};

// ✅ 获取当前用户的邀请码
export const getMyInviteCode = async (forceRefresh: boolean = false): Promise<string> => {
  const cacheKey = 'inviteCode:self';

  if (!forceRefresh) {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  try {
    const res = await apiClient.get('/api/users/my-code');
    const inviteCode = res.data.inviteCode ?? '';
    if (inviteCode) {
      await AsyncStorage.setItem(cacheKey, inviteCode);
    }
    return inviteCode;
  } catch (err) {
    console.warn('获取邀请码失败', err);
    return '';
  }
};

// ✅ 清除本地邀请码缓存
export const clearInviteCodeCache = async (): Promise<void> => {
  await AsyncStorage.removeItem('inviteCode:self');
};
