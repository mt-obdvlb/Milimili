import { VideoListItem } from '@mtobdvlb/shared-types'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'

const SearchUserVideoItem = ({ video }: { video: VideoListItem }) => {
  return (
    <div className={'relative w-full max-w-[16.666666%] flex-[0_0_16.666666%] px-[calc(16px*0.5)]'}>
      <TinyVideoItem showWatchLater hiddenUser video={video} />
    </div>
  )
}

export default SearchUserVideoItem
