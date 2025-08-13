import { useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useUserStore } from '../../user/store/useUserStore'
import { useRequestStore } from '../../requests/store/useRequestStore'
import { useAuthStore } from '../../../shared/stores/useAuthStore'

export const useAppInitialization = () => {
  const { userId, token } = useAuthStore()
  const { fetchRequests } = useRequestStore()
  const { initializeUser } = useUserStore()

  useEffect(() => {
    const init = async () => {
      await initializeUser()
    }
    init()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (userId && token) {
        fetchRequests()
      }
      return () => {}
    }, [userId, token, fetchRequests])
  )

  return {
    isAuthenticated: !!(userId && token),
  }
}



