'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Calendar, DatePickerSelectMode } from '@/components'
import DatePickerRoot from '@/components/layout/date-picker/DatePickerRoot'
import { useDatePicker } from '@/components/layout/date-picker/DatePickerProvider'
import { DateRange } from 'react-day-picker'

const DatePicker = ({
  setOpen,
  selectMode,
  disabledRange,
  setCurrentMonth,
  currentMonth,
  onComplete,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  selectMode: DatePickerSelectMode
  disabledRange: DateRange
  currentMonth: Date
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  onComplete: () => void
}) => {
  const { range, setRange } = useDatePicker()
  const [hoverDate, setHoverDate] = useState<Date | undefined>()
  return (
    <Calendar
      components={{
        Root: DatePickerRoot,
        Nav: () => <></>,
        MonthCaption: () => <></>,
      }}
      selectMode={selectMode}
      numberOfMonths={1}
      mode={'range'}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      min={0}
      required
      selected={range}
      onSelect={(val) => {
        if (!val) return

        if (selectMode === 'normal') {
          if (!range?.from) {
            setRange({ from: val.from })
          } else {
            setRange(val)
            setOpen(false)
            onComplete()
          }
        } else if (selectMode === 'start') {
          if (val.from) {
            setRange({ from: val.from, to: range?.to })
            setOpen(false)
            onComplete()
          }
        } else if (selectMode === 'end') {
          if (val.to) {
            setRange({ from: range?.from, to: val.to })
            setOpen(false)
            onComplete()
          }
        }
      }}
      modifiers={{
        hoverRange:
          hoverDate && (range?.from || range?.to)
            ? (date: Date) => {
                const current = date.getTime()
                let start: number
                let end: number

                if (selectMode === 'normal' && range?.from && !range?.to) {
                  start = range.from.getTime()
                  end = hoverDate.getTime()
                } else if (selectMode === 'start' && range?.to) {
                  start = hoverDate.getTime()
                  end = range.to.getTime()
                } else if (selectMode === 'end' && range?.from) {
                  start = range.from.getTime()
                  end = hoverDate.getTime()
                } else {
                  return false
                }

                return current > Math.min(start, end) && current < Math.max(start, end)
              }
            : undefined,
        hoverEnd: hoverDate,
      }}
      disabled={{
        before: disabledRange.from ?? new Date(2009, 0),
        after: disabledRange.to ?? new Date(),
      }}
      setHoverDate={setHoverDate}
      range={range}
      hoverDate={hoverDate}
    />
  )
}

export default DatePicker
