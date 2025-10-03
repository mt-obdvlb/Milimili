'use client'

import FeedPublishWrapper from '@/features/feed/components/FeedPublishWrapper'
import FeedFollowingUserList from '@/features/feed/components/FeedFollowingUserList'
import { useState } from 'react'
import FeedTabs from '@/features/feed/components/FeedTabs'
import FeedList from '@/features/feed/components/FeedList'

export type FeedPropsType = 'image-text' | 'video' | 'all'

const FeedMainWrapper = () => {
  const [type, setType] = useState<FeedPropsType>('all')
  const [userId, setUserId] = useState<string>('')

  return (
    <main className={'w-[724px] mr-3 relative'}>
      <FeedPublishWrapper />
      <FeedFollowingUserList setUserId={setUserId} userId={userId} />
      <section className={'w-full mb-2'}>
        <FeedTabs type={type} setType={setType} />
        <FeedList type={type} userId={userId} />
      </section>
    </main>
  )
}

export default FeedMainWrapper
