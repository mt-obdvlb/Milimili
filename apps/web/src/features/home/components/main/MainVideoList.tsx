'use client'

import { useVideoList } from '@/features/video/api'
import { useEffect, useMemo } from 'react'
import MainVideoItem from '@/features/home/components/main/MainVideoItem'
import MainVideoSkeleton from '@/features/home/components/main/MainVideoSkeleton'
import { useInView } from 'react-intersection-observer'

const MainVideoList = () => {
  const { videoRecommendList, videoRandomList, fetchNextPage } = useVideoList()
  const { ref, inView } = useInView({
    rootMargin: '100px',
    delay: 1000,
  })

  const totalList = useMemo(
    () => [...(videoRecommendList ?? []), ...(videoRandomList ?? [])],
    [videoRecommendList, videoRandomList]
  )

  useEffect(() => {
    if (inView) {
      void fetchNextPage()
    }
  }, [inView, fetchNextPage])

  return (
    <>
      {totalList.map((item, index) => (
        <MainVideoItem key={item.id + index} margin={index >= 6} video={item} />
      ))}
      {Array.from({ length: 15 }, (_, index) => (
        <MainVideoSkeleton ref={index === 0 ? ref : null} key={index} />
      ))}
    </>
  )
}

export default MainVideoList
