'use client'

import React from 'react'
import HeaderBarLeftEntry from '@/components/layout/header/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header/header-bar/HeaderBarRightEntry'
import { cn } from '@/lib'
import { SearchLogTop10List, UserGetInfoHome } from '@mtobdvlb/shared-types'
import {
  useFavoriteGetRecent,
  useFeedGetRecent,
  useHistoryGetRecent,
  useNotificationStatistics,
} from '@/features'

const NotFoundHeaderBar = ({
  searchLogTop10List,
  userHomeInfo,
}: {
  searchLogTop10List?: SearchLogTop10List
  userHomeInfo?: UserGetInfoHome
}) => {
  const type = 'second'
  const { favoriteRecentList } = useFavoriteGetRecent()
  const { notificationStatistics } = useNotificationStatistics()
  const { historyRecentList } = useHistoryGetRecent()
  const { feedRecentList } = useFeedGetRecent()

  return (
    <div
      className={cn(
        'flex h-[64px] w-full items-center px-[24px]',

        'bg-bg1_float animate-none shadow-[inset_0_-1px_0_var(--line_regular)]'
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

export default NotFoundHeaderBar
