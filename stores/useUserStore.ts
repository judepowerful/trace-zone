import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateUserId, getMyInviteCode } from '../utils/userApi';
import { fetchMySpace } from '../utils/spaceApi';
import { fetchSentRequest } from '../utils/requestApi';
import type { Space } from '../models/space';
import { useAuthStore } from './useAuthStore';

interface UserState {
  // 状态
  checking: boolean;
  myCode: string;
  hasSpace: boolean;
  sentRequest: any;
  
  // 方法
  setChecking: (checking: boolean) => void;
  setMyCode: (code: string) => void;
  setHasSpace: (hasSpace: boolean) => void;
  setSentRequest: (request: any) => void;
  
  // 初始化
  initializeUser: () => Promise<void>;
  
  // 刷新用户状态
  refreshUserStatus: () => Promise<void>;
  
  // 更新空间状态
  updateSpaceStatus: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  checking: true,
  myCode: '',
  hasSpace: false,
  sentRequest: null,
  
  // 设置方法
  setChecking: (checking) => set({ checking }),
  setMyCode: (myCode) => set({ myCode }),
  setHasSpace: (hasSpace) => set({ hasSpace }),
  setSentRequest: (sentRequest) => set({ sentRequest }),
  
  // 初始化用户（获取用户ID和token，并刷新用户状态）
  initializeUser: async () => {
    const { userId, token, setAuth } = useAuthStore.getState();
    
    // 如果没有用户ID或token，先获取
    if (!userId || !token) {
      const uid = await getOrCreateUserId();
      const token = await AsyncStorage.getItem('token') ?? '';
      setAuth(uid, token);
    }
    
    // 获取用户状态
    await get().refreshUserStatus();
  },
  
  // 刷新用户状态
  refreshUserStatus: async () => {
    const { setChecking, setMyCode, setHasSpace, setSentRequest } = get();
    const { userId, token } = useAuthStore.getState();
    
    if (!userId || !token) return;
    
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
  },
  
  // 更新空间状态（只更新 hasSpace，不更新其他状态）
  updateSpaceStatus: async () => {
    const { setHasSpace } = get();
    const { userId, token } = useAuthStore.getState();
    
    if (!userId || !token) return;
    
    try {
      const space: Space | null = await fetchMySpace();
      setHasSpace(space?.members?.length === 2);
    } catch (err) {
      console.warn('空间状态更新失败:', err);
      setHasSpace(false);
    }
  },
})); 