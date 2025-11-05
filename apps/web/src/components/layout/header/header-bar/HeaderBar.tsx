'use client'

import React, { useEffect, useState } from 'react'
import HeaderBarLeftEntry from '@/components/layout/header/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header/header-bar/HeaderBarRightEntry'
import { useWindowScroll } from 'react-use'
import { cn } from '@/lib'
import { SearchLogTop10List, UserGetInfoHome } from '@mtobdvlb/shared-types'
import {
  useFavoriteGetRecent,
  useFeedGetRecent,
  useHistoryGetRecent,
  useMessageStatistics,
} from '@/features'

const HeaderBar = ({
  searchLogTop10List,
  userHomeInfo,
  isFixed,
  bg,
  allFirst,
}: {
  searchLogTop10List?: SearchLogTop10List
  userHomeInfo?: UserGetInfoHome
  isFixed?: boolean
  bg?: string
  allFirst?: boolean
}) => {
  const { y } = useWindowScroll()
  const [type, setType] = useState<'first' | 'second'>('first')

  const { favoriteRecentList } = useFavoriteGetRecent()
  const { messageStatistics } = useMessageStatistics()
  const { historyRecentList } = useHistoryGetRecent()
  const { feedRecentList } = useFeedGetRecent()

  useEffect(() => {
    if (allFirst) {
      setType('first')
      return
    }
    if (isFixed) {
      setType('second')
    } else {
      if (y > 64) {
        setType('second')
      } else {
        setType('first')
      }
    }
  }, [y, type, isFixed, allFirst])
  return (
    <div
      className={cn(
        'absolute top-0 left-0 z-1002 flex h-[64px] w-full items-center px-[24px]',
        type === 'second' &&
          'bg-bg1_float fixed top-0 animate-none shadow-[inset_0_-1px_0_var(--line_regular)]',
        bg
      )}
    >
      <HeaderBarLeftEntry type={type} />
      <HeaderBarSearchBar searchLogTop10List={searchLogTop10List} />
      <HeaderBarRightEntry
        favoriteRecentList={favoriteRecentList}
        feedRecentList={feedRecentList}
        notificationStatistics={messageStatistics}
        historyRecentList={historyRecentList}
        userHomeInfo={userHomeInfo}
        type={type}
      />
    </div>
  )
}

export default HeaderBar
