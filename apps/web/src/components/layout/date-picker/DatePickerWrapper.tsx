'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components'
import DatePicker from '@/components/layout/date-picker/DatePicker'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DatePickerProvider } from '@/components/layout/date-picker/DatePickerProvider'
import { cn } from '@/lib'

export type DatePickerSelectMode = 'normal' | 'start' | 'end'

const DatePickerWrapper = ({
  resetKey,
  range,
  setRange,
  className,
  onComplete,
}: {
  resetKey: number
  range?: DateRange
  setRange: Dispatch<SetStateAction<DateRange | undefined>>
  className?: string
  onComplete: () => void
}) => {
  const [open, setOpen] = useState(false)
  const [selectMode, setSelectMode] = useState<DatePickerSelectMode>('normal')
  const [disabledRange, setDisabledRange] = useState<DateRange>({
    from: new Date(2009, 0),
    to: new Date(),
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const formatDate = (date?: Date): string | undefined =>
    date
      ? `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '')}月${String(
          date.getDate()
        ).padStart(2, '0')}日`
      : undefined

  useEffect(() => {
    setRange(undefined)
    setOpen(false)
    setSelectMode('normal')
    setDisabledRange({
      from: new Date(2009, 0),
      to: new Date(),
    })
    setCurrentMonth(new Date())
  }, [resetKey, setRange])

  const isSelected: boolean = useMemo(() => !!(range?.from && range?.to), [range])

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            if (!range?.from || !range?.to) {
              setRange(undefined)
            }
          }
          setOpen(open)
        }}
      >
        <div className={cn('mr-sm mt-sm', className)}>
          <div className={'relative flex w-full items-center select-none'}>
            <PopoverTrigger asChild>
              <div
                onClick={() => {
                  if (range?.from) {
                    setSelectMode('start')
                    setDisabledRange(() => ({
                      from: new Date(2009, 0),
                      to: range.to,
                    }))
                  } else {
                    setSelectMode('normal')
                  }
                  setOpen(true)
                }}
                className={cn(
                  'bg-bg1_float hover:border-brand_blue border-line_regular text-text4 flex h-[34px] w-[140px] cursor-pointer items-center justify-center rounded-[8px] border text-sm transition-all duration-300',
                  isSelected && 'text-brand_blue bg-brand_blue_thin border-brand_blue_thin'
                )}
              >
                {isSelected ? formatDate(range!.from) : '开始日期'}
              </div>
            </PopoverTrigger>

            <span className={'text-text2 px-2 text-sm'}>至</span>
            <PopoverTrigger asChild>
              <div
                onClick={() => {
                  if (range?.to) {
                    setSelectMode('end')
                    setDisabledRange(() => ({
                      from: range.from,
                      to: new Date(),
                    }))
                  } else {
                    setSelectMode('normal')
                  }
                  console.log(selectMode)
                  setOpen(true)
                }}
                className={cn(
                  'bg-bg1_float hover:border-brand_blue border-line_regular text-text4 flex h-[34px] w-[140px] cursor-pointer items-center justify-center rounded-[8px] border text-sm transition-all duration-300',
                  isSelected && 'text-brand_blue bg-brand_blue_thin border-brand_blue_thin'
                )}
              >
                {isSelected ? formatDate(range!.to) : '结束日期'}
              </div>
            </PopoverTrigger>
          </div>
        </div>
        <PopoverContent
          className={
            'bg-bg1_float border-line_regular min-w-[322px] overflow-hidden rounded-[12px] border p-0 shadow-[0_0_30px_rgba(0,0,0,0.1)]'
          }
        >
          <div className={'relative overflow-hidden'}>
            <DatePickerProvider value={{ range, setRange }}>
              <DatePicker
                onComplete={onComplete}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                disabledRange={disabledRange}
                selectMode={selectMode}
                setOpen={setOpen}
              />
            </DatePickerProvider>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default DatePickerWrapper
