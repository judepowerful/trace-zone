import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { deleteMySpace } from '../utils/spaceApi';

export function useDeleteSpace() {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMySpace();
      await AsyncStorage.removeItem('currentSpaceId');
      router.replace('/');
    } catch (err) {
      console.error('删除小屋失败', err);
      // 可以在这里弹 Alert
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, handleDelete };
}
