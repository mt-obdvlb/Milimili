'use client'

import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'

const DatePicker = () => {
  const [range, setRange] = React.useState<DateRange>()
  const [month, setMonth] = React.useState<Date>(new Date())
  const [viewMode, setViewMode] = React.useState<'month' | 'year'>('month')

  // 自定义 Caption
  const CustomCaption = () => {
    const year = month.getFullYear()
    const monthLabel = month.toLocaleString('zh-CN', { month: 'long' })

    return (
      <div className='flex items-center justify-between px-2 py-1'>
        <button className='font-bold text-blue-500' onClick={() => setViewMode('year')}>
          {year}年
        </button>
        <span>{monthLabel}</span>
      </div>
    )
  }

  // 年份选择面板
  const YearView = () => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let y = currentYear - 15; y <= currentYear + 5; y++) {
      years.push(y)
    }

    return (
      <div className='grid grid-cols-3 gap-4 p-4'>
        {years.map((y) => (
          <button
            key={y}
            className={`rounded-md px-3 py-2 ${
              y === month.getFullYear() ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              const newMonth = new Date(month)
              newMonth.setFullYear(y)
              setMonth(newMonth)
              setViewMode('month')
            }}
          >
            {y}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      {viewMode === 'year' ? (
        <YearView />
      ) : (
        <Calendar
          mode='range'
          month={month}
          onMonthChange={setMonth}
          selected={range}
          onSelect={setRange}
          required
          components={{ CaptionLabel: CustomCaption }}
          className={''}
          showOutsideDays
          navLayout={'after'}
          disabled={{ after: new Date() }}
          endMonth={new Date()}
          animate
          min={0}
        />
      )}
    </div>
  )
}

export default DatePicker
