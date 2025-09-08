'use client'

import { useWatchLaterList } from '@/features/watch-later/api'
import { useState } from 'react'
import {
  VideoGetWatchLaterAddAt,
  VideoGetWatchLaterSort,
  VideoGetWatchLaterTime,
  VideoGetWatchLaterType,
} from '@mtobdvlb/shared-types'
import { DateRange } from 'react-day-picker'
import WatchLaterTitle from '@/features/watch-later/components/WatchLaterTitle'
import WatchLaterFilterWrapper from '@/features/watch-later/components/WatchLaterFilterWrapper'
import WatchLaterVideoList from '@/features/watch-later/components/WatchLaterVideoList'

export type WatchLaterIds = {
  videoId: string
  favoriteId: string
}[]

const WatchLaterWrapper = () => {
  const [sort, setSort] = useState<VideoGetWatchLaterSort>('latest')
  const [type, setType] = useState<VideoGetWatchLaterType>('all')
  const [time, setTime] = useState<VideoGetWatchLaterTime>('all')
  const [addAt, setAddAt] = useState<VideoGetWatchLaterAddAt>('all')
  const [kw, setKw] = useState('')
  const [range, setRange] = useState<DateRange | undefined>()
  const [isDetail, setIsDetail] = useState(false)
  const [isSelect, setIsSelect] = useState(false)
  const [ids, setIds] = useState<WatchLaterIds>([])
  const { videoWatchLaterList } = useWatchLaterList({
    sort,
    type,
    time,
    addAt,
    kw,
    to: range?.to,
    from: range?.from,
  })
  return (
    <div className={'mx-auto min-w-[1060px] pt-[30px]'}>
      <WatchLaterTitle
        isDetail={isDetail}
        setIsDetail={setIsDetail}
        setSort={setSort}
        sort={sort}
        total={videoWatchLaterList?.length}
      />
      <WatchLaterFilterWrapper
        ids={ids}
        setTime={setTime}
        setAddAt={setAddAt}
        addAt={addAt}
        time={time}
        setRange={setRange}
        range={range}
        setType={setType}
        type={type}
        setKw={setKw}
        isDetail={isDetail}
        isSelect={isSelect}
        setIsSelect={setIsSelect}
        setIds={setIds}
        videoWatchLaterList={videoWatchLaterList}
      />
      <WatchLaterVideoList
        ids={ids}
        isSelect={isSelect}
        setIds={setIds}
        isDetail={isDetail}
        videoWatchLaterList={videoWatchLaterList}
      />
      <div className={'text-text2 my-30 text-center text-sm'}>
        <p className={'font-normal'}>已经探索到底了～</p>
      </div>
    </div>
  )
}

export default WatchLaterWrapper
