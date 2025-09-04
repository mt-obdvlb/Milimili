'use client'

import { DatePickerMode } from '@/components/layout/date-picker/DatePickerRoot'
import { Dispatch, SetStateAction } from 'react'
import { useDayPicker } from 'react-day-picker'
import { cn } from '@/lib'

const DatePickerMonth = ({ setMode }: { setMode: Dispatch<SetStateAction<DatePickerMode>> }) => {
  const { goToMonth, months } = useDayPicker()

  const currentMonth = months?.[0]?.date ?? new Date()
  const currentYear = currentMonth.getFullYear()
  const today = new Date()
  const systemYear = today.getFullYear()
  const systemMonth = today.getMonth() + 1 // 系统当前月（1~12）

  const monthsArr = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className='p-4'>
      <div className='grid max-h-[calc(6*(8px+30px))] grid-cols-3 gap-x-[34px] gap-y-2 overflow-auto'>
        {monthsArr.map((m) => {
          const disabled =
            currentYear > systemYear || (currentYear === systemYear && m > systemMonth)

          return (
            <div
              key={m}
              className={cn(
                'text-text1 flex h-[30px] cursor-pointer items-center justify-center rounded-[8px] text-sm transition-all duration-300',
                disabled
                  ? 'text-text4 cursor-not-allowed'
                  : 'hover:text-brand_blue hover:bg-brand_blue_thin hover:border-brand_blue_thin',
                m === systemMonth && 'border-brand_blue border',
                m === currentMonth.getMonth() + 1 &&
                  'bg-brand_blue hover:bg-brand_blue text-white hover:text-white'
              )}
              onClick={() => {
                if (disabled) return

                const newMonth = new Date(currentMonth)
                newMonth.setMonth(m - 1)
                goToMonth(newMonth)
                setMode('normal')
              }}
            >
              {m}月
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DatePickerMonth
