import { SearchGetItem } from '@mtobdvlb/shared-types'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import { cn } from '@/lib'

const SearchVideoItem = ({ video }: { video: SearchGetItem }) => {
  return (
    <div className={cn('relative mb-10 w-full max-w-[20%] flex-[0_0_20%] px-[calc(16px*0.5)]')}>
      <TinyVideoItem
        showWatchLater
        video={{
          ...video.video!,
          username: video.user.name,
          userId: video.user.id,
        }}
      />
    </div>
  )
}

export default SearchVideoItem
