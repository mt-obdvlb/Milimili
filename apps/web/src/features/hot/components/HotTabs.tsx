'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import Image from 'next/image'
import { useVideoList } from '@/features'
import HotVideoItem from '@/features/hot/components/HotVideoItem'
import InfiniteScroll from 'react-infinite-scroll-component'

const HotTabs = () => {
  const { videoRandomList, fetchNextPage } = useVideoList()
  return (
    <Tabs defaultValue={'hot'} className={'mx-auto my-0 max-w-[1286px] min-w-[107px] p-0 pb-20'}>
      <TabsList className={'border-b-line_regular flex h-21 w-full items-center border-b'}>
        <TabsTrigger
          value={'hot'}
          className={
            'data-[state=active]:border-b-brand_blue mr-10 flex h-full cursor-pointer items-center border-b-2 border-b-transparent pr-[5px]'
          }
        >
          <div className={'flex items-center'}>
            <Image
              src={'/images/icon_popular.png'}
              alt={'hot'}
              height={36}
              className={'mr-2.5 inline-block'}
              width={36}
            />
            <span className={'text-text1 text-[16px] transition duration-300'}>综合热门</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={'hot'} className={'min-h-[100vh] p-0 pt-5'}>
        <div className={'text-text2 mb-[30px] flex justify-between text-sm font-normal'}>
          <p>各个领域中新奇好玩的优质内容都在这里~</p>
        </div>
        <div className={'relative cursor-default'}>
          <InfiniteScroll
            next={fetchNextPage}
            dataLength={videoRandomList.length}
            hasMore={true}
            loader={<></>}
          >
            <ul className={'flex flex-wrap'}>
              {videoRandomList.map((item, index) => (
                <HotVideoItem key={item.id + index} video={item} />
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default HotTabs
