'use client'

import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import SearchSearchBar from '@/features/search/components/SearchSearchBar'
import SearchFilterWrapper from '@/features/search/components/SearchFilterWrapper'
import SearchAllList from '@/features/search/components/SearchAllList'
import SearchUserList from '@/features/search/components/SearchUserList'
import { cn } from '@/lib'
import * as React from 'react'
import { useCallback, useState } from 'react'
import {
  SearchLogTop10List,
  SearchPublishedAt,
  SearchSort,
  SearchTime,
  SearchType,
} from '@mtobdvlb/shared-types'
import { useSearch } from '@/features'
import { DateRange } from 'react-day-picker'

type Props = {
  kw: string
  searchLogTop10List?: SearchLogTop10List
}

const SearchWrapper = ({ kw, searchLogTop10List }: Props) => {
  const [type, setType] = useState<SearchType>('all')
  const [sort, setSort] = useState<SearchSort>('all')
  const [time, setTime] = useState<SearchTime>('all')
  const [publishedAt, setPublishedAt] = useState<SearchPublishedAt>('all')
  const [range, setRange] = useState<DateRange>()

  // ✅ 本地分页
  const [page, setPage] = useState<number>(1)

  // ✅ 切换分类时统一处理：更新 type 并重置 page
  const handleTypeChange = useCallback((next: SearchType) => {
    setType(next)
    setPage(1)
  }, [])

  const isRangeSelect = range?.from && range.to

  // ✅ 传入 page 给 useSearch（useQuery 版本）
  const { searchList, searchUser, total } = useSearch({
    kw,
    type,
    sort,
    time,
    publishedAt,
    page,
    from: isRangeSelect && range.from,
    to: isRangeSelect && range.to,
  })

  // 为了类型安全，定义 tabs 元数据
  const tabs: ReadonlyArray<{
    name: string
    value: SearchType
  }> = [
    { name: '综合', value: 'all' },
    { name: '视频', value: 'video' },
    { name: '用户', value: 'user' },
  ] as const

  return (
    <Tabs value={type} onValueChange={(v) => handleTypeChange(v as SearchType)}>
      <div>
        <div className='mt-[25px] mb-[15px]'>
          <div className='flex items-center justify-center'>
            <SearchSearchBar kw={kw} searchLogTop10List={searchLogTop10List} />
          </div>
        </div>

        <div className='mx-auto w-full max-w-[2200px] px-16'>
          <TabsList className='relative flex items-center justify-start'>
            {tabs.map((item) => (
              <TabsTrigger className='group' key={item.value} value={item.value}>
                <span className='hover:text-brand_blue group-data-[state=active]:text-brand_blue text-text2 flex cursor-pointer items-center justify-start p-2.5 px-5 text-[16px] select-none group-first-of-type:pl-0'>
                  <span className='relative mr-1 font-medium whitespace-nowrap transition-colors duration-200'>
                    {item.name}
                    <span className='bg-brand_blue absolute right-0 -bottom-3 left-0 hidden h-1 rounded-[2px] group-data-[state=active]:block' />
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Separator className='mt-[5px]' />

        {/* 用户 Tab 不显示筛选器 */}
        <div className={cn(type === 'user' && 'hidden')}>
          <SearchFilterWrapper
            range={range}
            setRange={setRange}
            sort={sort}
            time={time}
            publishedAt={publishedAt}
            setSort={(v) => {
              setSort(v)
              setPage(1)
            }} // 可选：筛选变化也回到第1页
            setTime={(v) => {
              setTime(v)
              setPage(1)
            }}
            setPublishedAt={(v) => {
              setPublishedAt(v)
              setPage(1)
            }}
          />
        </div>
      </div>

      <TabsContent value='all'>
        <SearchAllList
          searchList={searchList}
          searchUser={searchUser}
          page={page}
          setPage={setPage}
          total={total}
        />
      </TabsContent>

      <TabsContent value='video'>
        <SearchAllList
          searchList={searchList}
          searchUser={searchUser}
          page={page}
          setPage={setPage}
          total={total}
        />
      </TabsContent>

      <TabsContent value='user'>
        <SearchUserList total={total} page={page} setPage={setPage} searchList={searchList} />
      </TabsContent>
    </Tabs>
  )
}

export default SearchWrapper
