import { useEffect } from 'react'
import { getSocket } from '../../../shared/lib/socket'
import { useRequestStore } from '../../requests/store/useRequestStore'
import { useUserStore } from '../../user/store/useUserStore'
import { useAuthStore } from '../../../shared/stores/useAuthStore'
import { REQUEST_EVENTS } from '../../../events/requestEvents'

export default function useRequestSocket() {
  const userId = useAuthStore(state => state.userId)
  const token = useAuthStore(state => state.token)
  const addRequest = useRequestStore(state => state.addRequest)
  const removeRequestById = useRequestStore(state => state.removeRequestById)
  const fetchRequests = useRequestStore(state => state.fetchRequests)
  const setSentRequest = useUserStore(state => state.setSentRequest)

  useEffect(() => {
    if (!userId || !token) return
    const socket = getSocket()

    const onNew = async ({ request }: { request: any }) => {
      await addRequest(request)
    }

    const onCancelled = async ({ id }: { id: string }) => {
      await removeRequestById(id)
    }

    const onConsumed = async ({ id }: { id: string }) => {
      await removeRequestById(id)
    }

    const onAccepted = ({ id }: { id: string }) => {
      setSentRequest(null)
    }

    socket.on(REQUEST_EVENTS.NEW, onNew)
    socket.on(REQUEST_EVENTS.CANCELLED, onCancelled)
    socket.on(REQUEST_EVENTS.CONSUMED, onConsumed)
    socket.on(REQUEST_EVENTS.ACCEPTED, onAccepted)

    fetchRequests()

    return () => {
      socket.off(REQUEST_EVENTS.NEW, onNew)
      socket.off(REQUEST_EVENTS.CANCELLED, onCancelled)
      socket.off(REQUEST_EVENTS.CONSUMED, onConsumed)
      socket.off(REQUEST_EVENTS.ACCEPTED, onAccepted)
    }
  }, [userId, token, addRequest, removeRequestById, fetchRequests, setSentRequest])

  return null
}


