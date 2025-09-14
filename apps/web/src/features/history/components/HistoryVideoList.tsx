'use client'

import { HistoryGetList } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { Dispatch, SetStateAction } from 'react'
import { tv } from 'tailwind-variants'
import { groupHistoryList } from '@/features/history/groupHistoryList'
import HistoryTimeLineItem from '@/features/history/components/HistoryTimeLineItem'

const HistoryVideoList = ({
  historyList,
  isDetail,
  setIds,
  isSelect,
  ids,
}: {
  isDetail: boolean
  setIds: Dispatch<SetStateAction<string[]>>
  isSelect: boolean
  ids: string[]
  historyList?: HistoryGetList
}) => {
  const groupedHistoryList = groupHistoryList(historyList)

  const historyStyles = tv({
    slots: {
      start: cn(
        'bottom-full absolute left-[15px] w-[2px] h-[94px] bg-[linear-gradient(0deg,var(--line_bold)_0%,transparent_100%)]'
      ),
      end: cn(
        'top-full absolute left-[15px] w-[2px] h-[94px] bg-[linear-gradient(100deg,var(--line_bold)_0%,transparent_100%)]'
      ),
    },
  })

  const { start, end } = historyStyles()

  return (
    <section
      className={cn('mx-auto mt-5 w-[1152px]', isDetail && 'w-[1002px] pr-[50px] pl-[90px]')}
    >
      <div>
        <div className={'relative'}>
          <div className={start()}></div>
        </div>
        {groupedHistoryList.map((item, index) => (
          <HistoryTimeLineItem
            total={groupedHistoryList.length}
            index={index}
            key={item.label}
            label={item.label}
            historyList={item.value}
            isDetail={isDetail}
            setIds={setIds}
            isSelect={isSelect}
            ids={ids}
          />
        ))}
        <div className={'relative'}>
          <div className={end()}></div>
        </div>
      </div>
    </section>
  )
}

export default HistoryVideoList
