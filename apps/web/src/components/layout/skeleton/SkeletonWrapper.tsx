'use client'

import VideoSkeleton from '@/components/layout/skeleton/VideoSkeleton'
import React from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const SkeletonWrapper = ({ fetchData }: { fetchData: () => void }) => {
  const { ref } = useInfiniteScroll(fetchData)
  return (
    <>
      {Array.from({ length: 15 }, (_, index) => (
        <VideoSkeleton mt={index >= 5} ref={index === 0 ? ref : null} key={index} />
      ))}
    </>
  )
}

export default SkeletonWrapper
