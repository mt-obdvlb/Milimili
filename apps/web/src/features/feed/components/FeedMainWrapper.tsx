'use client'

import FeedPublishWrapper from '@/features/feed/components/FeedPublishWrapper'
import FeedFollowingUserList from '@/features/feed/components/FeedFollowingUserList'
import { useState } from 'react'
import FeedTabs from '@/features/feed/components/FeedTabs'
import FeedList from '@/features/feed/components/FeedList'
import { FeedType } from '@mtobdvlb/shared-types'

export type FeedPropsType = FeedType | 'all'

const FeedMainWrapper = () => {
  const [type, setType] = useState<FeedPropsType>('all')
  const [userId, setUserId] = useState<string>('')
  //const { feedList } = useFeedList({ type, userId })

  return (
    <main className={'w-[724px] mr-3 relative'}>
      <FeedPublishWrapper />
      <FeedFollowingUserList setUserId={setUserId} userId={userId} />
      <section className={'w-full mb-2'}>
        <FeedTabs type={type} setType={setType} />
        <FeedList />
      </section>
    </main>
  )
}

export default FeedMainWrapper
