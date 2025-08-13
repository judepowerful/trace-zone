import { create } from 'zustand';

interface GlobalState {
  // 全局加载状态
  globalLoading: boolean;
  
  // 应用初始化状态
  isInitialized: boolean;
  
  // 方法
  setGlobalLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  
  // 初始化应用
  initializeApp: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  // 初始状态
  globalLoading: false,
  isInitialized: false,
  
  // 设置方法
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  
  // 初始化应用
  initializeApp: async () => {
    const { setGlobalLoading, setInitialized } = get();
    
    setGlobalLoading(true);
    
    try {
      // 这里可以添加应用初始化逻辑
      // 比如检查用户登录状态、加载必要的数据等
      
      setInitialized(true);
    } catch (error) {
      console.error('应用初始化失败:', error);
    } finally {
      setGlobalLoading(false);
    }
  },
})); 