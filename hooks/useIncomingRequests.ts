import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getPendingRequestsForUser } from '../utils/requestApi';

export const useIncomingRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchRequests = async () => {
        if (!active) return;
        console.log('📬 正在轮询 Incoming Requests at', new Date().toLocaleTimeString());
        try {
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
    }, [])
  );

  return { requests, setRequests };
};
