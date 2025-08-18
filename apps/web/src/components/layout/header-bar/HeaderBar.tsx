import React from 'react'
import HeaderBarLeftEntry from '@/components/layout/header-bar/HeaderBarLeftEntry'
import HeaderBarSearchBar from '@/components/layout/header-bar/HeaderBarSearchBar'
import HeaderBarRightEntry from '@/components/layout/header-bar/HeaderBarRightEntry'
import { getSearchLogTop10 } from '@/features/search-log/api'

const HeaderBar = async () => {
  const { searchLogTop10List } = await getSearchLogTop10()

  return (
    <div className={'absolute top-0 left-0 z-1002 flex h-[64px] w-full items-center px-[24px]'}>
      <HeaderBarLeftEntry />
      <HeaderBarSearchBar searchLogTop10List={searchLogTop10List} />
      <HeaderBarRightEntry />
    </div>
  )
}

export default HeaderBar
