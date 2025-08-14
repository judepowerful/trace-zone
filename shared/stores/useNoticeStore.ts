import { create } from 'zustand'

type NoticeType = 'success' | 'error' | 'info' | null

interface NoticeState {
  visible: boolean
  type: NoticeType
  title: string
  message: string
  show: (payload: { type?: NoticeType; title?: string; message: string }) => void
  hide: () => void
}

export const useNoticeStore = create<NoticeState>((set) => ({
  visible: false,
  type: null,
  title: '',
  message: '',
  show: ({ type = 'info', title = '', message }) => set({ visible: true, type, title, message }),
  hide: () => set({ visible: false, type: null, title: '', message: '' }),
}))


