import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { getSocket } from '../../../shared/lib/socket'

export default function useFeedCat(spaceId: string, refetch: () => Promise<any>) {
  const [feeding, setFeeding] = useState(false)

  const feedCat = useCallback(async () => {
    if (!spaceId) return false
    try {
      setFeeding(true)
      const socket = getSocket()
      socket.emit('feed-cat', { spaceId })
      await refetch()
      return true
    } catch (e) {
      Alert.alert('喂食失败', '请稍后再试')
      return false
    } finally {
      setFeeding(false)
    }
  }, [spaceId, refetch])

  useEffect(() => {
    if (!spaceId) return
    let isMounted = true
    let cleanup = () => {}

    const setup = () => {
      const socket = getSocket()
      if (!isMounted) return

      const onCatFed = (data: any) => {
        console.log('📥 Received partner-fed event:', data)
        if (data?.todayFeeding?.fedUsers) {
          refetch()
        }
      }

      socket.on('partner-fed', onCatFed)
      cleanup = () => socket.off('partner-fed', onCatFed)
    }

    setup()

    return () => {
      isMounted = false
      cleanup()
    }
  }, [spaceId, refetch])

  return { feedCat, feeding }
}



