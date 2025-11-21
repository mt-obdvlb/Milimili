'use client'

import { useVideoList } from '@/features'
import SkeletonWrapper from '@/components/layout/skeleton/SkeletonWrapper'
import { useMemo } from 'react'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import RecommendedSwiper from '@/components/layout/swiper/RecommendedSwiper'
import { VideoList } from '@mtobdvlb/shared-types'
import { useTitle } from 'react-use'

const CategoryMainVideoList = ({
  videoSwiperList,
  categoryName,
}: {
  videoSwiperList?: VideoList
  categoryName?: string
}) => {
  const { videoRecommendList, videoRandomList, fetchNextPage } = useVideoList()
  const totalList = useMemo(
    () => [...(videoRecommendList?.slice(0, 3) ?? []), ...(videoRandomList ?? [])],
    [videoRecommendList, videoRandomList]
  )
  useTitle(
    categoryName
      ? `${categoryName}-咪哩咪哩 (゜-゜)つロ 干杯~-milimili`
      : '咪哩咪哩 (゜-゜)つロ 干杯~-milimili'
  )
  return (
    <>
      <div className={'grid grid-cols-5 gap-x-[20px] gap-y-[63px] pb-[63px]'}>
        <RecommendedSwiper
          pt={'pt-[27%]'}
          className={'row-span-1'}
          videoSwiperList={videoSwiperList}
        />
        {totalList.map((item, index) => (
          <TinyVideoItem video={item} key={item.id + index} />
        ))}
      </div>
      <div className={'grid grid-cols-5 gap-x-[20px] gap-y-[63px] pb-[63px]'}>
        <SkeletonWrapper fetchData={fetchNextPage} />
      </div>
    </>
  )
}

export default CategoryMainVideoList
