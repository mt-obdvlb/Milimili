'use client'
import { FeedDetailTabsType } from '@/features/feed/components/detail/FeedDetailMainWrapper'

import { Dispatch, SetStateAction } from 'react'
import { TabsList, TabsTrigger } from '@/components'
import { LayoutGroup, motion } from 'motion/react'
import { FeedGetById } from '@mtobdvlb/shared-types'

const FeedDetailTabs = ({
  setType,
  type,
  feed,
}: {
  setType: Dispatch<SetStateAction<FeedDetailTabsType>>
  type: FeedDetailTabsType
  feed: FeedGetById
}) => {
  return (
    <div className={'pl-[26px] h-12 bg-bg1 border-b border-b-line_regular'}>
      <TabsList className={'w-full flex items-center h-full'}>
        <LayoutGroup>
          {[
            { label: `评论 ${feed.comments}`, value: 'comment' },
            { label: `赞与转发 ${feed.likes + feed.references}`, value: 'likeTranspont' },
          ].map((item) => (
            <TabsTrigger
              onClick={() => setType(item.value as FeedDetailTabsType)}
              key={item.value}
              className={
                'data-[state=active]:text-brand_blue text-text2 cursor-pointer text-[18px] font-medium h-[25px] leading-[25px] ml-[30px] transition-colors duration-200 select-none'
              }
              value={item.value}
            >
              <motion.span className={'inline-block relative'} layout>
                {item.label}
                {type === item.value && (
                  <motion.span
                    className={'absolute bg-brand_blue inset-x-0 top-[34px] w-full h-0.5 z-1'}
                    layoutId={'feed-detail-underline'}
                    transition={{
                      duration: 0.4,
                    }}
                  ></motion.span>
                )}
              </motion.span>
            </TabsTrigger>
          ))}
        </LayoutGroup>
      </TabsList>
    </div>
  )
}

export default FeedDetailTabs
