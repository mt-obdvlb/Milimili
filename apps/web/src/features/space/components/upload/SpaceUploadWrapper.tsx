'use client'
import { ReactNode, useEffect, useState } from 'react'
import SpaceCommonTabs, { CommonTabItem } from '@/features/space/components/common/SpaceCommonTabs'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: '视频', value: 'video' },
  { name: '图文', value: 'feed' },
] satisfies CommonTabItem<'video' | 'feed'>[]

const SpaceUploadWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  const [type, setType] = useState<'video' | 'feed'>('video')

  useEffect(() => {
    setType(pathname.split('/').pop() as 'video' | 'feed')
  }, [pathname])

  return (
    <>
      <div className={'shrink-0 mr-4 w-[150px] h-[300px] sticky top-20'}>
        <SpaceCommonTabs link type={type} setType={setType} tabs={tabs} />
      </div>
      <div className={'flex-[1_1_0%]'}>{children}</div>
    </>
  )
}

export default SpaceUploadWrapper
