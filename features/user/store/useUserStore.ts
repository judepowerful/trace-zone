import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getOrCreateUserId, getMyInviteCode } from '../../user/api'
import { fetchMySpace } from '../../space/api/spaceApi'
import { fetchSentRequest } from '../../requests/api/requestApi'
import type { Space } from '../../../models/space'
import { useAuthStore } from '../../../shared/stores/useAuthStore'

interface UserState {
  checking: boolean
  myCode: string
  hasSpace: boolean
  sentRequest: any
  setChecking: (checking: boolean) => void
  setMyCode: (code: string) => void
  setHasSpace: (hasSpace: boolean) => void
  setSentRequest: (request: any) => void
  initializeUser: () => Promise<void>
  refreshUserStatus: () => Promise<void>
  updateSpaceStatus: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  checking: true,
  myCode: '',
  hasSpace: false,
  sentRequest: null,

  setChecking: (checking) => set({ checking }),
  setMyCode: (myCode) => set({ myCode }),
  setHasSpace: (hasSpace) => set({ hasSpace }),
  setSentRequest: (sentRequest) => set({ sentRequest }),

  initializeUser: async () => {
    const { userId, token, setAuth } = useAuthStore.getState()
    if (!userId || !token) {
      const uid = await getOrCreateUserId()
      const token = (await AsyncStorage.getItem('token')) ?? ''
      setAuth(uid, token)
    }
    await get().refreshUserStatus()
  },

  refreshUserStatus: async () => {
    const { setChecking, setMyCode, setHasSpace, setSentRequest } = get()
    const { userId, token } = useAuthStore.getState()
    if (!userId || !token) return
    setChecking(true)
    try {
      const code = await getMyInviteCode()
      setMyCode(code)
      const space: Space | null = await fetchMySpace()
      setHasSpace(space?.members?.length === 2)
      const request = await fetchSentRequest()
      setSentRequest(request)
    } catch (err) {
      console.warn('用户状态检查失败:', err)
      setMyCode('')
      setHasSpace(false)
      setSentRequest(null)
    } finally {
      setChecking(false)
    }
  },

  updateSpaceStatus: async () => {
    const { setHasSpace } = get()
    const { userId, token } = useAuthStore.getState()
    if (!userId || !token) return
    try {
      const space: Space | null = await fetchMySpace()
      setHasSpace(space?.members?.length === 2)
    } catch (err) {
      console.warn('空间状态更新失败:', err)
      setHasSpace(false)
    }
  },
}))


