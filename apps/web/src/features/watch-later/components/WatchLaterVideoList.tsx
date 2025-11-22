'use client'

import { VideoGetWaterLaterList } from '@mtobdvlb/shared-types'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import { cn } from '@/lib'
import WatchLaterVideoDetailItem from '@/features/watch-later/components/WatchLaterVideoDetailItem'
import WatchLaterDeleteBtn from '@/features/watch-later/components/WatchLaterDeleteBtn'
import FavoriteCheckBox from '@/features/favorite/components/FavoriteCheckBox'
import { Dispatch, SetStateAction } from 'react'
import { FavoriteIds } from '@/features/watch-later/components/WatchLaterWrapper'

const WatchLaterVideoList = ({
  videoWatchLaterList,
  isDetail,
  setIds,
  isSelect,
  ids,
}: {
  videoWatchLaterList?: VideoGetWaterLaterList
  isDetail: boolean
  setIds: Dispatch<SetStateAction<FavoriteIds>>
  isSelect: boolean
  ids: FavoriteIds
}) => {
  return (
    <section
      className={cn(
        'bg-bg1 mx-auto my-2.5 grid max-w-[calc(1080px+2*100px)] grid-cols-4 gap-x-4 gap-y-[50px] px-25',
        isDetail && 'max-w-[calc(890px+2*100px)] grid-cols-1 gap-x-0 gap-y-4'
      )}
    >
      {videoWatchLaterList?.map((video) => {
        return (
          <div key={video.id} className={'relative size-full'}>
            {isDetail ? (
              <WatchLaterVideoDetailItem video={video} key={video.id} />
            ) : (
              <div className={'relative size-full'} key={video.id}>
                <TinyVideoItem hiddenDanmu hiddenTime video={video} key={video.id} />
                <WatchLaterDeleteBtn
                  favoriteId={video.favoriteId}
                  className={'right-0 bottom-0 text-[18px]'}
                />
              </div>
            )}
            {isSelect && (
              <FavoriteCheckBox
                setIds={setIds}
                id={{
                  videoId: video.id,
                  favoriteId: video.favoriteId,
                }}
                ids={ids}
              />
            )}
          </div>
        )
      })}
    </section>
  )
}

export default WatchLaterVideoList
