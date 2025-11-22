'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib'
import { Dispatch, MouseEvent, SetStateAction, useMemo } from 'react'
import { FavoriteIds } from '@/features/watch-later/components/WatchLaterWrapper'
import { Label } from '@/components'

const FavoriteAllCheck = ({
  setIds,
  ids,
  allIds,
  totalNumber,
}: {
  totalNumber: number
  allIds: FavoriteIds
  setIds: Dispatch<SetStateAction<FavoriteIds>>
  ids: FavoriteIds
}) => {
  // 是否全选
  const check = useMemo(() => !!totalNumber && ids.length === totalNumber, [ids, totalNumber])

  // 点击全选 / 取消全选
  const handleCheck = (value: boolean) => {
    if (value) {
      // 全选

      setIds(allIds)
    } else {
      // 全不选
      setIds([])
    }
  }

  const handleLabelClick = (e: MouseEvent) => {
    e.preventDefault() // 防止 label 默认行为
    handleCheck(!check)
  }

  return (
    <Label
      onClick={handleLabelClick}
      className='text-4 group leading-md text-text1 relative inline-flex cursor-pointer items-center'
    >
      <span className='relative inline-block leading-[1]'>
        <Checkbox
          checked={check}
          onCheckedChange={(value) => handleCheck(!!value)}
          className='pointer-events-none absolute inset-0 -z-1 m-[3px] ml-[4px] box-border size-full cursor-pointer'
        />
        <span
          className={cn(
            'bg-bg1 group-hover:border-brand_pink border-line_regular relative block size-[14px] rounded-[4px] border leading-[1] transition-all duration-300 ease-in-out',
            check && 'bg-brand_pink border-brand_pink'
          )}
        >
          <span
            className={cn(
              'absolute top-[50%] left-[25%] table h-2 w-1 -translate-1/2 scale-0 rotate-45 border-2 border-t-0 border-l-0 border-white opacity-0 transition-all duration-300 ease-in-out',
              check && 'translate-x-[20%] -translate-y-[60%] scale-100 rotate-45 opacity-100'
            )}
          />
        </span>
      </span>
      <span className='px-smx select-none'>全选</span>
    </Label>
  )
}

export default FavoriteAllCheck
