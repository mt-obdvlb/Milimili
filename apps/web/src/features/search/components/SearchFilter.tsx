'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { SearchPublishedAt, SearchSort, SearchTime } from '@mtobdvlb/shared-types'
import { Button } from '@/components'
import { cn } from '@/lib'
import SearchConditionRow from '@/features/search/components/SearchConditionRow'

type SearchFilterProps = {
  setSort: Dispatch<SetStateAction<SearchSort>>
  setTime: Dispatch<SetStateAction<SearchTime>>
  setPublishedAt: Dispatch<SetStateAction<SearchPublishedAt>>
  sort: SearchSort
  publishedAt: SearchPublishedAt
  time: SearchTime
}

const sortList = [
  { label: '综合排序', value: 'all' },
  { label: '最多播放', value: 'view' },
  { label: '最新发布', value: 'publishedAt' },
  { label: '最多弹幕', value: 'danmaku' },
  { label: '最多收藏', value: 'favorite' },
] as const

const timeList = [
  { label: '全部时间', value: 'all' },
  { label: '10分钟以上', value: '10' },
  { label: '10-30分钟', value: '10to30' },
  { label: '30-60分钟', value: '30to60' },
  { label: '60分钟以上', value: '60' },
] as const

const publishedAtList = [
  { label: '全部日期', value: 'all' },
  { label: '最近一天', value: 'today' },
  { label: '最近一周', value: 'week' },
  { label: '最近半年', value: 'halfYear' },
] as const

const SearchFilter = ({
  sort,
  setSort,
  setPublishedAt,
  setTime,
  time,
  publishedAt,
}: SearchFilterProps) => {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    if (open) {
      const h = el.scrollHeight
      el.style.height = '0px'
      requestAnimationFrame(() => {
        el.style.height = h + 'px'
      })
      const end = () => {
        el.style.height = 'auto'
        el.removeEventListener('transitionend', end)
      }
      el.addEventListener('transitionend', end)
    } else {
      const h = el.scrollHeight
      el.style.height = h + 'px'
      requestAnimationFrame(() => {
        el.style.height = '0px'
      })
    }
  }, [open])
  return (
    <div className={'mx-auto mt-[20px] w-full max-w-[2200px] px-16'}>
      <div className={'flex items-center justify-between'}>
        <SearchConditionRow<SearchSort> value={sort} set={setSort} list={sortList} />
        <Button
          className={
            'text-text1 bg-bg1_float border-line_regular hover:bg-graph_bg_thick inline-flex h-[34px] min-w-25 cursor-pointer items-center justify-around rounded-[8px] border px-2.5 text-sm leading-[1] whitespace-nowrap duration-200 select-none'
          }
          onClick={() => setOpen(!open)}
        >
          更多筛选
          <svg
            data-v-22ff42d3=''
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='24'
            height='24'
            className={cn(
              'size-[13px] rotate-90 transition-all duration-200',
              open && '-rotate-90'
            )}
          >
            <path
              d='M8.5429 3.04289C8.15237 3.43342 8.15237 4.06658 8.5429 4.45711L15.909 11.8232C16.0066 11.9209 16.0066 12.0791 15.909 12.1768L8.5429 19.5429C8.15237 19.9334 8.15237 20.5666 8.5429 20.9571C8.93342 21.3476 9.56659 21.3476 9.95711 20.9571L17.3232 13.591C18.2019 12.7123 18.2019 11.2877 17.3232 10.409L9.95711 3.04289C9.56659 2.65237 8.93342 2.65237 8.5429 3.04289z'
              fill='currentColor'
            ></path>
          </svg>
        </Button>
      </div>
      <div ref={ref} className={cn('overflow-hidden transition-[height] duration-200')}>
        <SearchConditionRow<SearchPublishedAt>
          value={publishedAt}
          set={setPublishedAt}
          list={publishedAtList}
          mt
        ></SearchConditionRow>
        <SearchConditionRow<SearchTime>
          value={time}
          set={setTime}
          list={timeList}
          mt
        ></SearchConditionRow>
        <div className='flex flex-wrap items-center justify-start'>
          <div className={'text-text4 relative mt-[10px] ml-[10px] flex h-8 items-center text-sm'}>
            分区筛选维护升级中，敬请期待
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter
