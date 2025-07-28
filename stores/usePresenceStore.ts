// stores/usePresenceStore.ts
import { create } from 'zustand'

interface PresenceState {
  partnerOnline: boolean
  setPartnerOnline: (online: boolean) => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  partnerOnline: false,
  setPartnerOnline: (online) => set({ partnerOnline: online })
}))
