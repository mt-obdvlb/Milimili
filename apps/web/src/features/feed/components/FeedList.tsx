'use client'

import { useFeedGetList } from '@/features'
import { useInfiniteScroll } from '@/hooks'
import Image from 'next/image'
import FeedListItem from '@/features/feed/components/FeedLisItem'

const FeedList = () => {
  const { feedList, refetch, fetchNextPage, hasNextPage } = useFeedGetList()

  const { ref: fetchRef } = useInfiniteScroll(fetchNextPage)

  return (
    <div className={'mt-2'}>
      <div>
        {feedList.map((item) => (
          <FeedListItem key={item.id} feed={item} />
        ))}
      </div>
      {hasNextPage && (
        <div
          className={'items-center justify-center flex bg-bg1 rounded-[6px] h-[72px] w-full'}
          ref={fetchRef}
        >
          <div className={'items-center flex text-text3 justify-center text-sm'}>
            <Image
              src={'/images/loading.gif'}
              alt={'\n' + '    正在玩命加载…\n' + '  '}
              height={24}
              width={24}
              className={'aspect-square mr-2'}
            />
            {'\n' + '    正在玩命加载…\n' + '  '}
          </div>
        </div>
      )}
      {!feedList.length && (
        <div className={'items-center flex justify-center bg-bg1 rounded-[4px] h-[273px] w-full'}>
          <div className={'items-center flex flex-col h-[166px] justify-between w-[280px]'}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='118'
              height='100'
              viewBox='0 0 118 100'
              fill='none'
              className={'mt-[15px] w-[118px] h-25'}
            >
              <g opacity='0.6'>
                <rect x='26' y='71' width='72' height='29' rx='14.5' fill='#C1C5CA'></rect>{' '}
                <rect
                  x='0.109375'
                  y='24.0244'
                  width='98.0342'
                  height='73.0255'
                  rx='8.00279'
                  transform='rotate(-11.1891 0.109375 24.0244)'
                  fill='#DEE1E5'
                ></rect>{' '}
                <rect
                  x='6.33203'
                  y='75.1777'
                  width='105.679'
                  height='21.6363'
                  rx='4.32551'
                  transform='rotate(-11.1891 6.33203 75.1777)'
                  fill='#DEE1E5'
                ></rect>{' '}
                <rect
                  x='46.7266'
                  y='72.9278'
                  width='25.5511'
                  height='6.00209'
                  rx='3.00105'
                  transform='rotate(-11.1891 46.7266 72.9278)'
                  fill='#C1C5CA'
                ></rect>{' '}
                <rect x='77' y='91' width='41' height='9' rx='4.5' fill='#C1C5CA'></rect>{' '}
                <path
                  d='M104.46 13.7973L116.186 9.92658L117.15 18.0336L104.46 16.3797L104.46 13.7973Z'
                  fill='#C1C5CA'
                ></path>{' '}
                <path
                  d='M101.489 10.4357L110.109 1.04482L114.728 5.92168L102.284 12.6185L101.489 10.4357Z'
                  fill='#C1C5CA'
                ></path>
              </g>
            </svg>
            <div className={'text-text3 text-sm h-5 tracking-normal leading-5'}>
              <span>好像没有东西诶，点击</span>
              <span onClick={() => refetch} className={'text-brand_blue cursor-pointer'}>
                刷新
              </span>
              <span>重新加载</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedList
