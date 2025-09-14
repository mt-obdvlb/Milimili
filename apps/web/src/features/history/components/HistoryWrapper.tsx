'use client'

import { useState } from 'react'
import { HistoryGetTime, HistoryGetWatchAt } from '@mtobdvlb/shared-types'
import { DateRange } from 'react-day-picker'
import HistoryTitle from '@/features/history/components/HistoryTitle'
import HistoryFilterWrapper from '@/features/history/components/HistoryFilterWrapper'
import HistoryVideoList from '@/features/history/components/HistoryVideoList'
import { useHistoryList } from '@/features'
import { useInfiniteScroll } from '@/hooks'

const HistoryWrapper = () => {
  const [time, setTime] = useState<HistoryGetTime>('all')
  const [watchAt, setWatchAt] = useState<HistoryGetWatchAt>('all')
  const [kw, setKw] = useState('')
  const [range, setRange] = useState<DateRange | undefined>()
  const [isDetail, setIsDetail] = useState(false)
  const [isSelect, setIsSelect] = useState(false)
  const [ids, setIds] = useState<string[]>([])
  const { historyList, fetchNextPage } = useHistoryList({
    time,
    kw,

    to: range?.to,
    from: range?.from,
    watchAt,
  })
  const { ref } = useInfiniteScroll(fetchNextPage)
  return (
    <div className={'mx-auto min-w-[1060px] pt-[30px]'}>
      <HistoryTitle isDetail={isDetail} setIsDetail={setIsDetail} />
      <HistoryFilterWrapper
        ids={ids}
        setTime={setTime}
        setWatchAt={setWatchAt}
        watchAt={watchAt}
        time={time}
        setRange={setRange}
        range={range}
        setKw={setKw}
        isDetail={isDetail}
        isSelect={isSelect}
        setIsSelect={setIsSelect}
        setIds={setIds}
        historyList={historyList}
      />
      <HistoryVideoList
        ids={ids}
        isSelect={isSelect}
        setIds={setIds}
        isDetail={isDetail}
        historyList={historyList}
      />
      <div ref={ref} className={'text-text3 py-30 text-center text-sm'}>
        已经到底了～
      </div>
    </div>
  )
}

export default HistoryWrapper
