import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateUserId, getMyInviteCode } from '../utils/userApi';
import { fetchMySpace } from '../utils/spaceApi';
import { fetchSentRequest } from '../utils/requestApi';
import type { Space } from '../models/space';
import { useAuthStore } from '../stores/useAuthStore';

export const useUserStatus = () => {
  const [checking, setChecking] = useState(true);
  const [myCode, setMyCode] = useState('');
  const [hasSpace, setHasSpace] = useState(false);
  const [sentRequest, setSentRequest] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);
  const storeUserId = useAuthStore(state => state.userId);
  const storeToken = useAuthStore(state => state.token);

  // 获取或创建用户ID
  useEffect(() => {
    const initAuth = async () => {
      if (!storeUserId || !storeToken) {
        const uid = await getOrCreateUserId();
        const token = await AsyncStorage.getItem('token') ?? '';
        setAuth(uid, token);
        setUserId(uid);
      } else {
        setUserId(storeUserId);
      }
    };
    initAuth();
  }, []);

  // 每次 focus 时检查用户状态
  // 这会在用户返回到这个屏幕时重新获取状态
  useFocusEffect(
    useCallback(() => {
      const fetchStatus = async () => {
        // 没有 userId 或 token 时不请求
        if (!storeUserId || !storeToken) return;
        
        setChecking(true);
        try {
          const code = await getMyInviteCode();
          setMyCode(code);

          const space: Space | null = await fetchMySpace();
          setHasSpace(space?.members?.length === 2);

          const request = await fetchSentRequest();
          setSentRequest(request);
        } catch (err) {
          console.warn('用户状态检查失败:', err);
          setMyCode('');
          setHasSpace(false);
          setSentRequest(null);
        } finally {
          setChecking(false);
        }
      };
      fetchStatus();
    }, [storeUserId, storeToken])
  );

  return {
    checking,
    hasSpace,
    myCode,
    sentRequest,
    setSentRequest,
  };
};