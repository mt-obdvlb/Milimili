'use client'

import { useVideoList } from '@/features/video/api'
import { useMemo } from 'react'
import TinyVideoItem from '@/components/layout/video/TinyVideoItem'
import SkeletonWrapper from '@/components/layout/skeleton/SkeletonWrapper'

const HomeMainVideoList = () => {
  const { videoRecommendList, videoRandomList, fetchNextPage } = useVideoList()

  const totalList = useMemo(
    () => [...(videoRecommendList ?? []), ...(videoRandomList ?? [])],
    [videoRecommendList, videoRandomList]
  )

  return (
    <>
      {totalList.map((item, index) => (
        <TinyVideoItem key={item.id + index} margin={index >= 6} video={item} />
      ))}
      <SkeletonWrapper fetchData={fetchNextPage} />
    </>
  )
}

export default HomeMainVideoList
