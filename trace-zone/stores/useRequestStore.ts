import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPendingRequestsForUser } from '../utils/requestApi';
import { useAuthStore } from './useAuthStore';

const READ_KEY = 'read_request_ids';

interface RequestState {
  // 状态
  requests: any[];
  unreadCount: number;
  
  // 方法
  setRequests: (requests: any[]) => void;
  setUnreadCount: (count: number) => void;
  
  // 获取请求
  fetchRequests: () => Promise<void>;
  
  // 计算未读数量
  calculateUnreadCount: () => Promise<void>;
  
  // 标记所有为已读
  markAllAsRead: () => Promise<void>;
  
  // 开始轮询
  startPolling: () => void;
  
  // 停止轮询
  stopPolling: () => void;
}

export const useRequestStore = create<RequestState>((set, get) => {
  let pollInterval: NodeJS.Timeout | null = null;
  
  return {
    // 初始状态
    requests: [],
    unreadCount: 0,
    
    // 设置方法
    setRequests: (requests) => set({ requests }),
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    
    // 获取请求
    fetchRequests: async () => {
      const { userId, token } = useAuthStore.getState();
      
      if (!userId || !token) return;
      
      try {
        const fresh = await getPendingRequestsForUser();
        set({ requests: fresh });
        
        // 重新计算未读数量
        await get().calculateUnreadCount();
      } catch (err) {
        console.warn('拉取请求失败', err);
      }
    },
    
    // 计算未读数量
    calculateUnreadCount: async () => {
      const { requests } = get();
      const readJson = await AsyncStorage.getItem(READ_KEY);
      const readIds: string[] = readJson ? JSON.parse(readJson) : [];
      
      const unread = requests.filter(r => !readIds.includes(r._id));
      set({ unreadCount: unread.length });
    },
    
    // 标记所有为已读
    markAllAsRead: async () => {
      const { requests } = get();
      const ids = requests.map(r => r._id);
      await AsyncStorage.setItem(READ_KEY, JSON.stringify(ids));
      set({ unreadCount: 0 });
    },
    
    // 开始轮询
    startPolling: () => {
      const { userId, token } = useAuthStore.getState();
      
      if (!userId || !token) return;
      
      // 先获取一次
      get().fetchRequests();
      
      // 设置轮询
      pollInterval = setInterval(() => {
        get().fetchRequests();
      }, 4000);
      
      console.log('🔄 开始轮询 Incoming Requests');
    },
    
    // 停止轮询
    stopPolling: () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
        console.log('🛑 已停止轮询 Incoming Requests');
      }
    },
  };
}); 