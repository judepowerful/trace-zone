import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRequestStore } from '../store/useRequestStore';

interface Request {
  _id: string;
  id?: string;
}

/**
 * 获取未读消息数量
 * @returns 未读消息数量
 */
export const useUnreadCount = () => {
  const unreadCount = useRequestStore((state: any) => state.unreadCount);
  return unreadCount;
};

/**
 * 标记所有消息为已读
 * @param requests 要标记为已读的请求列表（可选，如果不传则标记所有）
 */
export const markAllAsRead = async (requests?: Request[]) => {
  const { markAllAsRead: markRead } = useRequestStore.getState();
  
  if (requests && requests.length > 0) {
    // 如果传入了特定的请求列表，只标记这些为已读
    const { requests: allRequests } = useRequestStore.getState();
    const targetIds = requests.map((r: Request) => r._id || r.id);
    
    // 更新已读状态
    const readJson = await AsyncStorage.getItem('read_request_ids');
    const readIds: string[] = readJson ? JSON.parse(readJson) : [];
    const newReadIds = [...new Set([...readIds, ...targetIds])];
    await AsyncStorage.setItem('read_request_ids', JSON.stringify(newReadIds));
    
    // 重新计算未读数量
    const unread = allRequests.filter((r: any) => !newReadIds.includes(r._id));
    useRequestStore.getState().setUnreadCount(unread.length);
  } else {
    // 标记所有为已读
    await markRead();
  }
};
