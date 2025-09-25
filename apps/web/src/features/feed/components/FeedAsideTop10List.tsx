'use client'

import { SearchLogTop10List } from '@mtobdvlb/shared-types'
import Link from 'next/link'
import { cn } from '@/lib'
import Image from 'next/image'
import React from 'react'

const FeedAsideTop10List = ({
  searchLogTop10List,
}: {
  searchLogTop10List?: SearchLogTop10List
}) => {
  const rankColor: Record<number, string> = {
    1: 'text-[rgb(253,173,19)]',
    2: 'text-[rgb(138,172,225)]',
    3: 'text-[rgb(223,167,119)]',
  }

  return (
    <section className={'sticky top-[72px] w-full mb-2'}>
      <div className={'p-4 rounded-[6px] bg-bg1'}>
        <div className={'font-semibold text-[17px] text-text1'}>
          <div className={'mt-2 -mx-3'}>
            {searchLogTop10List?.map((item) => (
              <Link
                key={item.rank}
                href={`/search?kw=${item.keyword}`}
                className={
                  'px-3 rounded-[6px] hover:bg-graph_bg_thick  text-text1 hover:text-brand_blue flex items-center h-[41px] transition-all duration-300'
                }
              >
                <div
                  className={cn(
                    'shrink-0 mr-3 flex items-center justify-center size-[22px] text-[16px] italic font-[900]',
                    rankColor[item.rank] ?? 'text-graph_weak'
                  )}
                >
                  {item.rank}
                </div>
                <div
                  className={
                    'text-[15px] font-normal whitespace-nowrap text-ellipsis overflow-hidden transition-all duration-300'
                  }
                >
                  {item.keyword}
                </div>
                <div
                  className={
                    'shrink-0 ml-1 rounded-[4px] flex w-auto h-[14px] bg-[#f1f2f3] relative'
                  }
                >
                  {item.rank % 3 === 0 && (
                    <Image height={14} width={14} src={'/images/hot.png'} alt={'hot'} />
                  )}
                  {item.rank % 3 === 1 && (
                    <Image height={14} width={14} src={'/images/new.png'} alt={'new'} />
                  )}
                  {item.rank % 3 === 2 && (
                    <Image height={14} width={14} src={'/images/gen.png'} alt={'gen'} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeedAsideTop10List
