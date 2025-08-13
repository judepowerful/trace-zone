import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchMySpace } from '../../space/api/spaceApi'
import { useAuthStore } from '../../../shared/stores/useAuthStore'
import type { Space } from '../../../models/space'
import { router } from 'expo-router'

interface SpaceState {
  spaceInfo: Space | null
  loading: boolean
  setSpaceInfo: (space: Space | null) => void
  setLoading: (loading: boolean) => void
  fetchSpaceInfo: (showLoading?: boolean) => Promise<void>
  refetch: () => Promise<void>
  clearSpace: () => void
}

export const useSpaceStore = create<SpaceState>((set, get) => ({
  spaceInfo: null,
  loading: true,
  setSpaceInfo: (spaceInfo) => set({ spaceInfo }),
  setLoading: (loading) => set({ loading }),
  fetchSpaceInfo: async (showLoading = true) => {
    const { setSpaceInfo, setLoading } = get()
    const { userId } = useAuthStore.getState()
    if (!userId) {
      console.warn('⚠️ No userId in global store yet')
      return
    }
    if (showLoading) setLoading(true)
    try {
      const space = await fetchMySpace()
      if (!space || !Array.isArray(space.members) || space.members.length !== 2) {
        alert('❌ 小屋不存在或已解散，将返回首页')
        setSpaceInfo(null)
        await AsyncStorage.removeItem('currentSpaceId')
        router.replace('/')
        return
      }
      setSpaceInfo(space)
      await AsyncStorage.setItem('currentSpaceId', (space as any).id)
    } catch (err) {
      console.error('[❌] 加载小屋失败:', err)
      alert('⚠️ 无法进入小屋，可能已被删除，将返回首页')
      setSpaceInfo(null)
      await AsyncStorage.removeItem('currentSpaceId')
      router.replace('/')
    } finally {
      if (showLoading) setLoading(false)
    }
  },
  refetch: async () => {
    await get().fetchSpaceInfo(false)
  },
  clearSpace: () => {
    set({ spaceInfo: null, loading: false })
  },
}))


