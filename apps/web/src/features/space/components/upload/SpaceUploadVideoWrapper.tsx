'use client'
import { useState } from 'react'
import { VideoListSort } from '@mtobdvlb/shared-types'
import { useVideoListSpace } from '@/features'
import SpaceUploadVideoHeader from '@/features/space/components/upload/SpaceUploadVideoHeader'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import SpaceUploadVideoEmpty from '@/features/space/components/upload/SpaceUploadVideoEmpty'
import SpaceCommonPagination from '@/features/space/components/common/SpaceCommonPagination'

const SpaceUploadVideoWrapper = ({ userId }: { userId: string }) => {
  const [sort, setSort] = useState<VideoListSort>('publishedAt')
  const [page, setPage] = useState(1)

  const { videoSpaceList, total } = useVideoListSpace({ sort, page, userId, pageSize: 50 })

  if (!total) return <SpaceUploadVideoEmpty title={'视频'} />

  return (
    <div>
      <SpaceUploadVideoHeader sort={sort} setSort={setSort} />
      <div className={'mt-[30px] grid grid-cols-5 gap-y-5 gap-x-4 '}>
        {videoSpaceList.map((video) => (
          <TinyVideoItem hiddenUser hiddenPlayerTime video={video} key={video.id} />
        ))}
      </div>
      <div className={'py-15'}>
        <SpaceCommonPagination total={total} page={page} setPage={setPage} />
      </div>
    </div>
  )
}

export default SpaceUploadVideoWrapper
