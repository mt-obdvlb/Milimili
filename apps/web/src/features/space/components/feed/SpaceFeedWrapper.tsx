'use client'

import SpaceCommonTabs, { CommonTabItem } from '@/features/space/components/common/SpaceCommonTabs'
import { useState } from 'react'
import FeedList from '@/features/feed/components/FeedList'

const tabs: CommonTabItem<'all' | 'video'>[] = [
  { name: '全部', value: 'all' },
  { name: '视频', value: 'video' },
]

const SpaceFeedWrapper = ({ userId }: { userId: string }) => {
  const [type, setType] = useState<'all' | 'video'>('all')

  return (
    <>
      <SpaceCommonTabs tabs={tabs} type={type} setType={setType} />
      <div className={'flex-1 min-w-[558px] pl-5 overflow-hidden'}>
        <FeedList border type={type} userId={userId} />
      </div>
      <div className={'shrink-0 ml-4 w-60'}></div>
    </>
  )
}

export default SpaceFeedWrapper
