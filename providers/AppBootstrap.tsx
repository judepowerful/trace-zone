import { PropsWithChildren } from 'react'
import useRequestSocket from '../features/requests/hooks/useRequestSocket'
import { useAppInitialization } from '../features/user/hooks/useAppInitialization'

export default function AppBootstrap({ children }: PropsWithChildren) {
  // 全局初始化（用户信息等）
  useAppInitialization()
  // 全局请求 socket 订阅
  useRequestSocket()
  return children as any
}


