'use client'

import { Dispatch, SetStateAction } from 'react'
import { FeedPropsType } from '@/features/feed/components/FeedMainWrapper'
import { Tabs, TabsList, TabsTrigger } from '@/components'
import { LayoutGroup, motion } from 'motion/react'

const FeedTabs = ({
  type,
  setType,
}: {
  type: FeedPropsType
  setType: Dispatch<SetStateAction<FeedPropsType>>
}) => {
  // 基础 tabs 列表
  const tabList: { label: string; value: FeedPropsType }[] = [
    { label: '全部', value: 'all' },
    { label: '视频投稿', value: 'video' },
    { label: '专栏', value: 'image-text' },
  ]

  return (
    <Tabs
      className={'bg-bg1 rounded-[6px] h-12 relative w-full'}
      value={type}
      onValueChange={(v) => setType(v as FeedPropsType)}
    >
      <TabsList className={'flex h-full pl-5'}>
        <LayoutGroup>
          {tabList.map((item) => (
            <TabsTrigger
              className={
                'text-[15px] data-[state=active]:text-brand_blue hover:text-brand_blue leading-[25px] text-text2 items-center cursor-pointer font-normal h-full justify-center relative mr-8'
              }
              key={item.value}
              value={item.value}
            >
              <motion.span layout>
                <motion.span>{item.label}</motion.span>
                {type === item.value && (
                  <motion.span
                    layoutId='feed-underline'
                    className='bg-brand_blue  rounded-[1px] bottom-2 h-0.5 left-1/2 -translate-x-1/2  absolute w-[14px]'
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.span>
            </TabsTrigger>
          ))}
        </LayoutGroup>
      </TabsList>
    </Tabs>
  )
}

export default FeedTabs
