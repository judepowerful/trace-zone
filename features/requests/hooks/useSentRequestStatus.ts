import { useEffect } from 'react'
import { getSocket } from '../../../shared/lib/socket'
import { REQUEST_EVENTS } from '../../../events/requestEvents'

export const useSentRequestStatus = (
  sentRequest: any,
  hasSpace: boolean,
  setSentRequest: (r: any) => void,
  setAccepted: (v: boolean) => void
) => {
  useEffect(() => {
    if (!sentRequest || hasSpace) return

    const socket = getSocket()

    const onAccepted = ({ id }: { id: string }) => {
      if (id === sentRequest._id) {
        setAccepted(true)
        setSentRequest(null)
      }
    }

    const onRejected = ({ id }: { id: string }) => {
      if (id === sentRequest._id) {
        setSentRequest(null)
        alert('❌ 邀请已被拒绝，对方没有接受你的邀请')
      }
    }

    const onCancelled = ({ id }: { id: string }) => {
      if (id === sentRequest._id) {
        setSentRequest(null)
      }
    }

    socket.on(REQUEST_EVENTS.ACCEPTED, onAccepted)
    socket.on(REQUEST_EVENTS.REJECTED, onRejected)
    socket.on(REQUEST_EVENTS.CANCELLED, onCancelled)

    return () => {
      socket.off(REQUEST_EVENTS.ACCEPTED, onAccepted)
      socket.off(REQUEST_EVENTS.REJECTED, onRejected)
      socket.off(REQUEST_EVENTS.CANCELLED, onCancelled)
    }
  }, [sentRequest, hasSpace, setSentRequest, setAccepted])
}


