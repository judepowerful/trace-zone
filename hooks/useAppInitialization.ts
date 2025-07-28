import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '../stores/useUserStore';
import { useRequestStore } from '../stores/useRequestStore';
import { useSpaceStore } from '../stores/useSpaceStore';
import { useAuthStore } from '../stores/useAuthStore';

export const useAppInitialization = () => {
  const { userId, token } = useAuthStore();
  const { startPolling, stopPolling } = useRequestStore();
  const { initializeUser } = useUserStore();

  // 应用初始化
  useEffect(() => {
    const init = async () => {
      await initializeUser();
    };
    init();
  }, []); // 只在组件挂载时执行一次

  // 页面聚焦时的处理
  useFocusEffect(
    useCallback(() => {
      if (userId && token) {
        // 重新开始轮询
        startPolling();
      }

      return () => {
        // 页面失焦时停止轮询
        stopPolling();
      };
    }, [userId, token, startPolling, stopPolling])
  );

  return {
    isAuthenticated: !!(userId && token),
  };
}; 