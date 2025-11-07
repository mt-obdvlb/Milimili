'use client'
import { useState } from 'react'
import { VideoListSort } from '@mtobdvlb/shared-types'
import { useVideoListSpace } from '@/features'
import SpaceUploadVideoHeader from '@/features/space/components/upload/SpaceUploadVideoHeader'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import SpaceUploadVideoEmpty from '@/features/space/components/upload/SpaceUploadVideoEmpty'
import SearchPagination from '@/features/search/components/SearchPagination'
import { Input } from '@/components'

const SpaceUploadVideoWrapper = ({ userId }: { userId: string }) => {
  const [sort, setSort] = useState<VideoListSort>('publishedAt')
  const [page, setPage] = useState(1)

  const { videoSpaceList, total } = useVideoListSpace({ sort, page, userId, pageSize: 50 })

  if (!total) return <SpaceUploadVideoEmpty />

  return (
    <div>
      <SpaceUploadVideoHeader sort={sort} setSort={setSort} />
      <div className={'mt-[30px] grid grid-cols-5 gap-y-5 gap-x-4 '}>
        {videoSpaceList.map((video) => (
          <TinyVideoItem hiddenUser hiddenPlayerTime video={video} key={video.id} />
        ))}
      </div>
      <div className={'py-15'}>
        <div className={'w-fit mx-auto flex justify-start items-center whitespace-nowrap'}>
          <div className={'mr-11 flex items-center justify-start'}>
            <SearchPagination page={page} setPage={setPage} total={total} pageSize={50} />
          </div>
          <div className={'text-text1 flex items-center text-5'}>
            <span className={'mr-2'}>{`共 ${Math.ceil(total / 50)} 页 / ${total} 个，跳至`}</span>
            <div
              className={
                'w-[50px] overflow-hidden inline-flex grow relative bg-bg1 border border-line_regular text-4 rounded-md px-sm'
              }
            >
              <Input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = Number(e.currentTarget.value)
                    if (page < 1 || page > Math.ceil(total / 50)) {
                      e.currentTarget.value = ''
                      return
                    }
                    setPage(page)
                    e.currentTarget.blur()
                    e.currentTarget.value = ''
                  }
                }}
                className={'h-8 leading-[1.5] text-text1 w-full text-4'}
              />
            </div>
            <span className={'ml-2'}>页</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceUploadVideoWrapper
