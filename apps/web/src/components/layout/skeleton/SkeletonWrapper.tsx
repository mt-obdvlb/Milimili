'use client'

import VideoSkeleton from '@/components/layout/skeleton/VideoSkeleton'
import React from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const SkeletonWrapper = ({ fetchData }: { fetchData: () => void }) => {
  const { ref } = useInfiniteScroll(fetchData, { rootMargin: '250px' })
  return (
    <>
      {Array.from({ length: 15 }, (_, index) => (
        <VideoSkeleton mt={index >= 5} key={index} />
      ))}
      <div ref={ref}></div>
    </>
  )
}

export default SkeletonWrapper
