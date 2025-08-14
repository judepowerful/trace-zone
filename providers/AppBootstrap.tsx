import { PropsWithChildren, useState } from 'react'
import useRequestSocket from '../features/requests/hooks/useRequestSocket'
import { useAppInitialization } from '../features/user/hooks/useAppInitialization'
import CustomModal from '../components/modals/CustomModal'
import { useNoticeStore } from '../shared/stores/useNoticeStore'

export default function AppBootstrap({ children }: PropsWithChildren) {
  // 全局初始化（用户信息等）
  useAppInitialization()
  // 全局请求 socket 订阅
  useRequestSocket()
  const visible = useNoticeStore(state => state.visible)
  const type = useNoticeStore(state => state.type)
  const title = useNoticeStore(state => state.title)
  const message = useNoticeStore(state => state.message)
  const hide = useNoticeStore(state => state.hide)

  return (
    <>
      {children as any}
      <CustomModal
        visible={visible}
        type={type}
        title={title}
        message={message}
        onClose={hide}
        onDismiss={hide}
        dismissOnBackdropPress
      />
    </>
  )
}


