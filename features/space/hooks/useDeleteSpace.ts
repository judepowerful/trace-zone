import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteMySpace } from '../api/spaceApi';
import { useUserStore } from '../../user/store/useUserStore';

/**
 * 删除空间的 hook
 * @returns 删除空间的函数和加载状态
 */
export const useDeleteSpace = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { refreshUserStatus } = useUserStore();

  const handleDeleteSpace = async () => {
    Alert.alert(
      '确认删除',
      '删除空间后，所有数据将无法恢复。确定要删除吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteMySpace();
              await refreshUserStatus();
              router.replace('/');
            } catch (error) {
              Alert.alert('删除失败', '请稍后再试');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    deleteSpace: handleDeleteSpace,
    handleDelete: handleDeleteSpace,
    deleting: isDeleting,
    isDeleting,
  };
};
