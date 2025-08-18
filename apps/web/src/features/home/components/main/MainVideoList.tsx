'use client'

import { useVideoList } from '@/features/video/api'
import { useEffect, useMemo, useRef } from 'react'
import MainVideoItem from '@/features/home/components/main/MainVideoItem'
import MainVideoSkeleton from '@/features/home/components/main/MainVideoSkeleton'

const MainVideoList = () => {
  const { videoRecommendList, videoRandomList, fetchNextPage } = useVideoList()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const firstSkeletonRef = useRef<SVGSVGElement | null>(null)

  const totalList = useMemo(
    () => [...(videoRecommendList ?? []), ...(videoRandomList ?? [])],
    [videoRecommendList, videoRandomList]
  )

  useEffect(() => {
    if (!firstSkeletonRef.current) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage()
        }
      },
      { rootMargin: '100px' }
    )

    observerRef.current.observe(firstSkeletonRef.current)

    return () => observerRef.current?.disconnect()
  }, [fetchNextPage, totalList])

  return (
    <>
      {totalList.map((item, index) => (
        <MainVideoItem key={item.id + index} margin={index >= 6} video={item} />
      ))}
      {Array.from({ length: 15 }, (_, index) => (
        <MainVideoSkeleton ref={index === 0 ? firstSkeletonRef : null} key={index} />
      ))}
    </>
  )
}

export default MainVideoList
