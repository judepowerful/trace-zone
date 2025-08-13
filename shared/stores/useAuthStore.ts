import { create } from 'zustand'

interface AuthState {
  userId: string
  token: string
  setAuth: (userId: string, token: string) => void
  resetAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: '',
  token: '',
  setAuth: (userId, token) => set({ userId, token }),
  resetAuth: () => set({ userId: '', token: '' }),
}))


