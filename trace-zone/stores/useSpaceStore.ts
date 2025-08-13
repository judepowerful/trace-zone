import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMySpace } from '../utils/spaceApi';
import { useAuthStore } from './useAuthStore';
import type { Space } from '../models/space';
import { router } from 'expo-router';

interface SpaceState {
  // 状态
  spaceInfo: Space | null;
  loading: boolean;
  
  // 方法
  setSpaceInfo: (space: Space | null) => void;
  setLoading: (loading: boolean) => void;
  
  // 获取空间信息
  fetchSpaceInfo: (showLoading?: boolean) => Promise<void>;
  
  // 刷新空间信息
  refetch: () => Promise<void>;
  
  // 清除空间信息
  clearSpace: () => void;
}

export const useSpaceStore = create<SpaceState>((set, get) => ({
  // 初始状态
  spaceInfo: null,
  loading: true,
  
  // 设置方法
  setSpaceInfo: (spaceInfo) => set({ spaceInfo }),
  setLoading: (loading) => set({ loading }),
  
  // 获取空间信息
  fetchSpaceInfo: async (showLoading = true) => {
    const { setSpaceInfo, setLoading } = get();
    const { userId } = useAuthStore.getState();
    if (!userId) {
      console.warn("⚠️ No userId in global store yet");
      return;
    }
    if (showLoading) setLoading(true);
    try {
      const space = await fetchMySpace();
      if (!space || !Array.isArray(space.members) || space.members.length !== 2) {
        alert('❌ 小屋不存在或已解散，将返回首页');
        setSpaceInfo(null);
        await AsyncStorage.removeItem('currentSpaceId');
        router.replace('/');
        return;
      }
      setSpaceInfo(space);
      await AsyncStorage.setItem('currentSpaceId', space.id);
    } catch (err) {
      console.error('[❌] 加载小屋失败:', err);
      alert('⚠️ 无法进入小屋，可能已被删除，将返回首页');
      setSpaceInfo(null);
      await AsyncStorage.removeItem('currentSpaceId');
      router.replace('/');
    } finally {
      if (showLoading) setLoading(false);
    }
  },
  
  // 刷新空间信息
  refetch: async () => {
    await get().fetchSpaceInfo(false);
  },
  
  // 清除空间信息
  clearSpace: () => {
    set({ spaceInfo: null, loading: false });
  },
})); 