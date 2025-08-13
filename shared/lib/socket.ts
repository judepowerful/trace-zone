import { io, Socket } from 'socket.io-client'
import { BACKEND_URL } from '../config'
import { useAuthStore } from '../stores/useAuthStore'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const userId = useAuthStore.getState().userId
    const token = useAuthStore.getState().token
    socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      autoConnect: true,
      extraHeaders: {
        'x-user-id': userId,
        authorization: `Bearer ${token}`,
      },
    })
    console.log('🛰️ Socket client initialized with', userId, token)
  }
  return socket
}


