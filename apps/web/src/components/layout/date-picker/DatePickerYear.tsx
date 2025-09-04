'use client'

import { DatePickerMode } from '@/components/layout/date-picker/DatePickerRoot'
import { Dispatch, SetStateAction } from 'react'
import { useDayPicker } from 'react-day-picker'
import { cn } from '@/lib'

const DatePickerYear = ({ setMode }: { setMode: Dispatch<SetStateAction<DatePickerMode>> }) => {
  const { goToMonth, months } = useDayPicker()

  const years: number[] = Array.from(
    { length: new Date().getFullYear() - 2009 + 1 },
    (_, i) => 2009 + i
  )

  // 当前日历首月（可能是用户已翻到的月）
  const currentMonth = months?.[0]?.date ?? new Date()
  const currentMonthIndex = currentMonth.getMonth() // 0..11

  const today = new Date()
  const systemYear = today.getFullYear()
  const systemMonthIndex = today.getMonth() // 0..11

  return (
    <div className={'p-4'}>
      <div
        className={'grid max-h-[calc(6*(8px+30px))] grid-cols-3 gap-x-[34px] gap-y-2 overflow-auto'}
      >
        {years.map((year) => {
          const disabled =
            year > systemYear || (year === systemYear && currentMonthIndex > systemMonthIndex)
          return (
            <div
              key={year}
              className={cn(
                'text-text1 flex h-[30px] cursor-pointer items-center justify-center rounded-[8px] text-sm transition-all duration-300',
                disabled
                  ? 'text-text4 cursor-not-allowed'
                  : 'hover:text-brand_blue hover:bg-brand_blue_thin hover:border-brand_blue_thin',
                year === systemYear && 'border-brand_blue border',
                year === currentMonth.getFullYear() &&
                  'bg-brand_blue hover:bg-brand_blue text-white hover:text-white'
              )}
              onClick={() => {
                if (disabled) return
                const newMonth = new Date(currentMonth)
                newMonth.setFullYear(year)

                goToMonth(newMonth) // 切换日历到新年份
                setMode('normal')
              }}
            >
              {year}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DatePickerYear
