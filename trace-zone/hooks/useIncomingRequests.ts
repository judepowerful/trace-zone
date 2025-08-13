import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getPendingRequestsForUser } from '../utils/requestApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useIncomingRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const userId = useAuthStore(state => state.userId);
  const token = useAuthStore(state => state.token);
  
  useFocusEffect(
    useCallback(() => {
      if (!userId || !token) {
        // 不启动轮询
        return;
      }
      let active = true;

      const fetchRequests = async () => {
        if (!active) return;
        try {
          console.log('🔍 正在拉取请求');
          const fresh = await getPendingRequestsForUser();
          if (active) setRequests(fresh);
        } catch (err) {
          console.warn('拉取请求失败', err);
        }
      };

      fetchRequests(); // 初次
      const interval = setInterval(fetchRequests, 4000);

      return () => {
        active = false;
        clearInterval(interval);
        console.log('🛑 已停止轮询 Incoming Requests');
      };
    }, [userId, token])
  );

  return { requests, setRequests };
};
