'use client'

import React, { useEffect, useState } from 'react'
import HeaderBarLeftEntry from '@/components/layout/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header-bar/HeaderBarRightEntry'
import { SearchLogTop10Result } from '@/types/search-log'
import { useWindowScroll } from 'react-use'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib'

const HeaderBar = ({ searchLogTop10List }: { searchLogTop10List?: SearchLogTop10Result }) => {
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
      <HeaderBarSearchBar type={type} searchLogTop10List={searchLogTop10List} />
      <HeaderBarRightEntry type={type} />
    </div>
  )
}

export default HeaderBar
