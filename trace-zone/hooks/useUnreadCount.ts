import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const READ_KEY = 'read_request_ids';

export const useUnreadCount = (requests: any[]) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const calculate = async () => {
      const readJson = await AsyncStorage.getItem(READ_KEY);
      const readIds: string[] = readJson ? JSON.parse(readJson) : [];

      const unread = requests.filter(r => !readIds.includes(r._id));
      setUnreadCount(unread.length);
    };
    calculate();
  }, [requests]);

  return unreadCount;
};

export const markAllAsRead = async (requests: any[]) => {
  const ids = requests.map(r => r._id);
  await AsyncStorage.setItem(READ_KEY, JSON.stringify(ids));
};