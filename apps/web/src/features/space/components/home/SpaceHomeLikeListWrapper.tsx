'use client'

import SpaceHomeHeader from '@/features/space/components/home/SpaceHomeHeader'
import { useVideoLikeList } from '@/features'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'

const SpaceHomeLikeListWrapper = ({ userId }: { userId: string }) => {
  const { videoLikeList } = useVideoLikeList(userId)
  if (!videoLikeList.length) return null
  return (
    <div className={'pb-[24px] mb-[24px] border-b border-b-line_regular'}>
      <SpaceHomeHeader title={'最近点赞的视频'} isLink={false} />
      <div className={'grid grid-cols-5 gap-x-4 gap-y-5'}>
        {videoLikeList.map((video) => (
          <TinyVideoItem hiddenPublishAt hiddenPlayerTime video={video} key={video.id} />
        ))}
      </div>
    </div>
  )
}

export default SpaceHomeLikeListWrapper
