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
  useMessageStatistics,
} from '@/features'

const HeaderBarTypeTwo = ({
  searchLogTop10List,
  userHomeInfo,
  hidden,
}: {
  searchLogTop10List?: SearchLogTop10List
  userHomeInfo?: UserGetInfoHome
  hidden?: boolean
}) => {
  const type = 'second'
  const { favoriteRecentList } = useFavoriteGetRecent()
  const { messageStatistics } = useMessageStatistics()
  const { historyRecentList } = useHistoryGetRecent()
  const { feedRecentList } = useFeedGetRecent()

  return (
    <div
      className={cn(
        'flex h-[64px] w-full items-center px-[24px]',

        'bg-bg1_float animate-none shadow-[0_2px_4px_#00000014]',
        hidden && 'justify-between'
      )}
    >
      <HeaderBarLeftEntry type={type} />
      <HeaderBarSearchBar hidden={hidden} searchLogTop10List={searchLogTop10List} />
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

export default HeaderBarTypeTwo
