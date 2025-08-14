import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getPendingRequestsForUser } from '../../requests/api/requestApi'
import { useAuthStore } from '../../../shared/stores/useAuthStore'

const READ_KEY = 'read_request_ids'

interface RequestState {
  requests: any[]
  unreadCount: number
  setRequests: (requests: any[]) => void
  setUnreadCount: (count: number) => void
  addRequest: (request: any) => Promise<void>
  removeRequestById: (id: string) => Promise<void>
  fetchRequests: () => Promise<void>
  calculateUnreadCount: () => Promise<void>
  markAllAsRead: () => Promise<void>
}

export const useRequestStore = create<RequestState>((set, get) => {
  return {
    requests: [],
    unreadCount: 0,
    setRequests: (requests) => set({ requests }),
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    addRequest: async (request: any) => {
      const { requests } = get()
      set({ requests: [request, ...requests] })
      await get().calculateUnreadCount()
    },
    removeRequestById: async (id: string) => {
      const { requests } = get()
      set({ requests: requests.filter(r => r._id !== id) })
      await get().calculateUnreadCount()
    },
    fetchRequests: async () => {
      const { userId, token } = useAuthStore.getState()
      if (!userId || !token) return
      try {
        const fresh = await getPendingRequestsForUser()
        set({ requests: fresh })
        await get().calculateUnreadCount()
      } catch (err) {
        console.warn('拉取请求失败', err)
      }
    },
    calculateUnreadCount: async () => {
      const { requests } = get()
      const readJson = await AsyncStorage.getItem(READ_KEY)
      const readIds: string[] = readJson ? JSON.parse(readJson) : []
      const unread = requests.filter(r => !readIds.includes(r._id))
      set({ unreadCount: unread.length })
    },
    markAllAsRead: async () => {
      const { requests } = get()
      const ids = requests.map(r => r._id)
      await AsyncStorage.setItem(READ_KEY, JSON.stringify(ids))
      set({ unreadCount: 0 })
    },
  }
})

// 移除重复的导出，因为已经在上面导出了


