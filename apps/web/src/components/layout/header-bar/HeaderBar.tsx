'use client'

import React, { useEffect, useState } from 'react'
import HeaderBarLeftEntry from '@/components/layout/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header-bar/HeaderBarRightEntry'
import { useWindowScroll } from 'react-use'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib'
import {
  FavoriteRecentList,
  FeedRecentList,
  HistoryList,
  NotificationStatisticsList,
  SearchLogTop10List,
  UserGetInfoHome,
} from '@mtobdvlb/shared-types'

const HeaderBar = ({
  searchLogTop10List,
  userHomeInfo,
  favoriteRecentList,
  feedRecentList,
  historyRecentList,
  notificationStatistics,
}: {
  searchLogTop10List?: SearchLogTop10List
  userHomeInfo?: UserGetInfoHome
  historyRecentList?: HistoryList
  favoriteRecentList?: FavoriteRecentList
  notificationStatistics?: NotificationStatisticsList
  feedRecentList?: FeedRecentList
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
      <HeaderBarRightEntry
        favoriteRecentList={favoriteRecentList}
        feedRecentList={feedRecentList}
        notificationStatistics={notificationStatistics}
        historyRecentList={historyRecentList}
        userHomeInfo={userHomeInfo}
        type={type}
      />
    </div>
  )
}

export default HeaderBar
