'use client'

import React, { useEffect, useState } from 'react'
import HeaderBarLeftEntry from '@/components/layout/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header-bar/HeaderBarRightEntry'
import { SearchLogTop10Result } from '@/types/search-log'
import { useWindowScroll } from 'react-use'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib'
import { UserHomeInfoResult } from '@/types/user'

const HeaderBar = ({
  searchLogTop10List,
  userHomeInfo,
}: {
  searchLogTop10List?: SearchLogTop10Result
  userHomeInfo?: UserHomeInfoResult
}) => {
  const { y } = useWindowScroll()
  const pathname = usePathname()
  const [type, setType] = useState<'first' | 'second'>('first')

  useEffect(() => {
    if (pathname !== '/') {
      setType('second')
    } else {
      if (y > 64) {
        setType('second')
      } else {
        setType('first')
      }
    }
  }, [y, type, pathname])
  return (
    <div
      className={cn(
        'absolute top-0 left-0 z-1002 flex h-[64px] w-full items-center px-[24px]',
        type === 'second' &&
          'bg-bg1_float fixed top-0 animate-none shadow-[inset_0_-1px_0_var(--line_regular)]'
      )}
    >
      <HeaderBarLeftEntry type={type} />
      <HeaderBarSearchBar searchLogTop10List={searchLogTop10List} />
      <HeaderBarRightEntry userHomeInfo={userHomeInfo} type={type} />
    </div>
  )
}

export default HeaderBar
