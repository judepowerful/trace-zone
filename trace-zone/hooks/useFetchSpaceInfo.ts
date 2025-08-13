import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { fetchMySpace } from '../utils/spaceApi'
import { useAuthStore } from '../stores/useAuthStore'

import type { Space } from '../models/space'

export function useFetchSpaceInfo() {
  const [spaceInfo, setSpaceInfo] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const userId = useAuthStore(s => s.userId)

  const fetchData = useCallback(async () => {
    if (!userId) {
      console.warn("⚠️ No userId in global store yet")
      return
    }

    setLoading(true)

    try {
      const space = await fetchMySpace()

      if (!space || !Array.isArray(space.members) || space.members.length !== 2) {
        alert('❌ 小屋不存在或已解散，请重新创建')
        router.replace('/')
        return
      }

      setSpaceInfo(space)
      await AsyncStorage.setItem('currentSpaceId', space.id)
    } catch (err) {
      console.error('[❌] 加载小屋失败:', err)
      alert('⚠️ 无法进入小屋，可能已被删除')
      await AsyncStorage.removeItem('currentSpaceId')
      router.replace('/')
    } finally {
      setLoading(false)
    }
  }, [router, userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { spaceInfo, userId, loading, refetch: fetchData }
}
