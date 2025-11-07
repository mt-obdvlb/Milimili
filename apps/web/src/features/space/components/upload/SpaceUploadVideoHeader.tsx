import { VideoListSort } from '@mtobdvlb/shared-types'
import { Dispatch, SetStateAction } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components'
import { cn } from '@/lib'

const SpaceUploadVideoHeader = ({
  sort,
  setSort,
}: {
  sort: VideoListSort
  setSort: Dispatch<SetStateAction<VideoListSort>>
}) => {
  return (
    <div>
      <div className={'min-h-[34px] flex items-center'}>
        <div className={'text-text1 font-semibold text-[24px]'}>TA的视频</div>
      </div>
      <div className={'mt-[30px]'}>
        <Tabs
          value={sort}
          onValueChange={(value) => setSort(value as VideoListSort)}
          className={'flex-row items-center'}
        >
          <TabsList className={'flex text-sm gap-3 flex-wrap'}>
            {[
              { value: 'publishedAt', name: '最新发布' },
              { value: 'views', name: '最多播放' },
              { value: 'favorites', name: '最多收藏' },
            ].map((item) => (
              <TabsTrigger
                value={item.value}
                key={item.value}
                className={cn(
                  'flex items-center h-[34px] px-[15px] text-text2 shrink-0 cursor-pointer transition-all duration-300 rounded-[6px] bg-graph_bg_thin',
                  item.value === sort
                    ? 'text-white bg-brand_blue'
                    : 'hover:text-brand_blue hover:bg-graph_bg_thin'
                )}
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

export default SpaceUploadVideoHeader
