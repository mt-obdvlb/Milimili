'use client'

import { cloneElement, isValidElement, MouseEvent, ReactElement, ReactNode } from 'react'
import { useUserStore } from '@/stores'
import { useModel } from '@/hooks/useModel'

interface WithAuthProps {
  children: ReactNode
}

const WithAuth = ({ children }: WithAuthProps) => {
  const user = useUserStore((state) => state.user)
  const { openLoginModel } = useModel()

  if (user) return <>{children}</>

  // 不是有效 ReactElement → 原样返回（比如字符串）
  if (!isValidElement(children)) return <>{children}</>

  // 强制限制 children 必须是能接受 onClick 的元素
  const child = children as ReactElement<{ onClick?: (e: MouseEvent) => void }>

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openLoginModel()
  }

  return cloneElement(child, {
    ...child.props,
    onClick: handleClick,
  })
}

export default WithAuth
