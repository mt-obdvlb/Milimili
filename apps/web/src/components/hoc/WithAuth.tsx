'use client'

import { cloneElement, isValidElement, MouseEvent, ReactElement, ReactNode } from 'react'
import { useUserStore } from '@/stores'
import { useModel } from '@/hooks/useModel'
import { isServer } from '@/utils'

interface WithAuthProps {
  children: ReactNode
  none?: boolean
}

const WithAuth = ({ children, none }: WithAuthProps) => {
  const user = useUserStore((state) => state.user)
  const { openLoginModel } = useModel()

  const child = children as ReactElement<{ onClick?: (e: MouseEvent) => void }>

  if (isServer()) return cloneElement(child, { ...child.props })
  if (none) return cloneElement(child, { ...child.props })
  if (user) return cloneElement(child, { ...child.props })

  // 不是有效 ReactElement → 原样返回（比如字符串）
  if (!isValidElement(children)) return cloneElement(child, { ...child.props })

  // 强制限制 children 必须是能接受 onClick 的元素

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
