import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { getSocket } from '../../../shared/lib/socket'
import { usePresenceStore } from '../../../stores/usePresenceStore'

export default function useSpaceSocket(spaceId: string) {
  const router = useRouter()
  const setPartnerOnline = usePresenceStore(state => state.setPartnerOnline)

  useEffect(() => {
    if (!spaceId) return

    let isMounted = true
    let socketListenerCleanup = () => {}

    const connect = async () => {
      const socket = getSocket()

      if (!isMounted) return

      socket.emit('join-space', { spaceId })
      console.log('🛰️ 加入小屋', spaceId)

      const onPartnerStatus = ({ online }: { online: boolean }) => {
        console.log('👥 对方状态:', online)
        setPartnerOnline(online)
      }

      const onSpaceDeleted = ({ message }: { message: string }) => {
        console.log('⚠️ 小屋被解散:', message)
        alert('❌ 小屋已被解散')
        router.replace('/')
      }

      socket.on('partner-status', onPartnerStatus)
      socket.on('space-deleted', onSpaceDeleted)

      socketListenerCleanup = () => {
        socket.off('partner-status', onPartnerStatus)
        socket.off('space-deleted', onSpaceDeleted)
      }
    }

    connect()

    return () => {
      isMounted = false
      const socket = getSocket()
      socket.emit('leave-space', { spaceId })
      console.log('🚪 离开了小屋', spaceId)
      socketListenerCleanup()
    }
  }, [spaceId, setPartnerOnline, router])

  return null
}



