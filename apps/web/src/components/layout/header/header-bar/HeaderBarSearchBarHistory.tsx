'use client'

import HeaderBarSearchBarHistoryItem from '@/components/layout/header/header-bar/item/HeaderBarSearchBarHistoryItem'
import { Dispatch, SetStateAction } from 'react'

const HeaderBarSearchBarHistory = ({
  setHistorys,
  historys,
  remove,
}: {
  historys: string[] | undefined
  setHistorys: Dispatch<SetStateAction<string[] | undefined>>
  remove: () => void
}) => {
  if (!historys) return <></>
  if (historys?.length === 0) return <></>
  return (
    <div className={'max-w-[314px]'}>
      <div className={'flex items-center justify-between px-4'}>
        <div className={'h-6 text-[16px] leading-6 font-medium'}>搜索历史</div>
        <div
          onMouseDown={remove}
          className={'text-text3 h-[15px] cursor-pointer text-xs leading-[15px]'}
        >
          清空
        </div>
      </div>
      <div className={'max-h-[172px] overflow-hidden px-4'}>
        <div className={'mt-3 -mr-2.5 mb-1 flex flex-wrap'}>
          {historys?.map((item, index) => (
            <HeaderBarSearchBarHistoryItem
              setHistorys={setHistorys}
              history={item}
              key={item + index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeaderBarSearchBarHistory
