'use client'

import { MouseEventHandler, ReactNode } from 'react'
import { useUserStore } from '@/stores'
import { useModel } from '@/hooks/useModel'

const WithAuth = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state.user)
  const { openLoginModel } = useModel()

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    openLoginModel()
  }

  return <div onClickCapture={user ? undefined : handleClick}>{children}</div>
}

export default WithAuth
