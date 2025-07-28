import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { fetchRequestById } from '../utils/requestApi';
import { useAuthStore } from '../stores/useAuthStore';

export const useSentRequestStatus = (
  sentRequest: any,
  hasSpace: boolean,
  setSentRequest: (r: any) => void,
  setAccepted: (v: boolean) => void
) => {
  const userId = useAuthStore(state => state.userId);
  const token = useAuthStore(state => state.token);
  useFocusEffect(
    useCallback(() => {
      // 没有 sentRequest、空间已满、或未注册时不轮询
      if (!sentRequest || hasSpace || !userId || !token) return;
      
      let isMounted = true;

      const checkStatus = async () => {
        console.log('📤 正在轮询 Sent Request 状态 at', new Date().toLocaleTimeString());
        const updated = await fetchRequestById(sentRequest._id);
        if (!isMounted) return;

        if (!updated) {
          setSentRequest(null);
          clearInterval(interval); // ✅ 立即停止轮询
          console.log('🛑 已停止轮询（请求已被取消）');
          return;
        }

        if (updated.status === 'accepted') {
          setAccepted(true);
          clearInterval(interval); // ✅ 停止轮询
          console.log('🛑 已停止轮询（请求已被接受）');
        } else if (updated.status === 'rejected') {
          setSentRequest(null);
          alert('❌ 邀请已被拒绝，对方没有接受你的邀请');
          console.log('🛑 已停止轮询（请求被拒绝）');
        }
      };

      const interval = setInterval(checkStatus, 4000);
      checkStatus(); // 初始执行一次

      return () => {
        isMounted = false;
        clearInterval(interval);
        console.log('🛑 已停止轮询 Sent Request 状态');
      };
    }, [sentRequest, hasSpace])
  );
};
