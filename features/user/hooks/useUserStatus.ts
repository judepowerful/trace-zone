import { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getOrCreateUserId, getMyInviteCode } from '../../user/api'
import { fetchMySpace } from '../../space/api/spaceApi'
import { fetchSentRequest } from '../../requests/api/requestApi'
import type { Space } from '../../../models/space'
import { useAuthStore } from '../../../stores/useAuthStore'

export const useUserStatus = () => {
  const [checking, setChecking] = useState(true)
  const [myCode, setMyCode] = useState('')
  const [hasSpace, setHasSpace] = useState(false)
  const [sentRequest, setSentRequest] = useState<any>(null)
  const [userId, setUserId] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const storeUserId = useAuthStore(state => state.userId)
  const storeToken = useAuthStore(state => state.token)

  useEffect(() => {
    const initAuth = async () => {
      if (!storeUserId || !storeToken) {
        const uid = await getOrCreateUserId()
        const token = (await AsyncStorage.getItem('token')) ?? ''
        setAuth(uid, token)
        setUserId(uid)
      } else {
        setUserId(storeUserId)
      }
    }
    initAuth()
  }, [])

  useFocusEffect(
    useCallback(() => {
      const fetchStatus = async () => {
        if (!storeUserId || !storeToken) return
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
      }
      fetchStatus()
    }, [storeUserId, storeToken])
  )

  return { checking, hasSpace, myCode, sentRequest, setSentRequest }
}


