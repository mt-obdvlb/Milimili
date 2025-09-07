import { VideoGetWaterLaterList } from '@mtobdvlb/shared-types'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import { cn } from '@/lib'
import WatchLaterVideoDetailItem from '@/features/watch-later/components/WatchLaterVideoDetailItem'

const WatchLaterVideoList = ({
  videoWatchLaterList,
  isDetail,
}: {
  videoWatchLaterList?: VideoGetWaterLaterList
  isDetail: boolean
}) => {
  return (
    <section
      className={cn(
        'bg-bg1 mx-auto my-2.5 grid max-w-[calc(1080px+2*100px)] grid-cols-4 gap-x-4 gap-y-[50px] px-25',
        isDetail && 'max-w-[calc(890px+2*100px)] grid-cols-1 gap-x-0 gap-y-4'
      )}
    >
      {videoWatchLaterList?.map((video) => {
        {
          return isDetail ? (
            <WatchLaterVideoDetailItem video={video} key={video.id} />
          ) : (
            <TinyVideoItem hiddenTime video={video} key={video.id} />
          )
        }
      })}
    </section>
  )
}

export default WatchLaterVideoList
