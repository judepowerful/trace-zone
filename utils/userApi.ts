// utils/userApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import apiClient from './apiClient';

// ✅ 注册用户
export const registerUser = async (userId: string) => {
  try {
    const res = await apiClient.post('/api/users/register', { userId });
    const { inviteCode, token } = res.data;
    await AsyncStorage.setItem('inviteCode', inviteCode);
    await AsyncStorage.setItem('token', token);
    console.log("🎉 注册成功:", { userId, inviteCode });
  } catch (err) {
    console.warn('用户注册失败', err);
    throw err; // 让上层决定要不要走 refresh
  }
};

// ✅ 刷新 token
export const refreshToken = async (userId: string) => {
  try {
    const oldToken = await AsyncStorage.getItem('token');
    if (!oldToken) throw new Error("No old token found");

    const res = await apiClient.post('/api/users/refresh-token', {
      userId,
      oldToken
    });

    await AsyncStorage.setItem('token', res.data.token);
    console.log("🔄 成功刷新 token");
  } catch (err: any) {
    console.warn('🔁 无法刷新 token (将触发重新注册):', err.message);
    throw err;
  }
};


// ✅ 得到用户ID（首次生成并注册）
export const getOrCreateUserId = async (): Promise<string> => {
  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4();
    await AsyncStorage.setItem('userId', userId);
    await registerUser(userId);
    return userId;
  }

  // 有 userId 就尝试刷新 token
  try {
    await refreshToken(userId);
  } catch (err) {
    console.log("⚠️ token 失效，重新注册");
    userId = uuidv4();
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.removeItem('inviteCode:self');
    await registerUser(userId);
  }

  return userId;
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
